"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bot, ChevronDown, Globe2, Loader2, Mic, Sparkles, Square, Volume2, Wallet, Zap } from "lucide-react";
import {
  DEFAULT_VOICE_LANGUAGE,
  VOICE_CONFIG,
  type VoiceLanguageCode,
} from "@/lib/voice/config";

type WidgetState = "idle" | "recording" | "processing" | "playing" | "error";
type ConversationMessage = { role: "user" | "assistant"; content: string };
type ResponseAudioPayload = { audioBase64: string; audioMimeType: string };
type AgentMode =
  | "customer_support"
  | "lead_qualification"
  | "receptionist"
  | "cart_recovery";
type DisplayCurrency = "INR" | "USD";
const MAX_DEMO_CALL_SECONDS = 120;

const AGENT_MODE_OPTIONS: Array<{ value: AgentMode; label: string }> = [
  { value: "customer_support", label: "Customer Support" },
  { value: "lead_qualification", label: "Lead Qualification" },
  { value: "receptionist", label: "Receptionist" },
  { value: "cart_recovery", label: "Cart Recovery" },
];

type SessionLanguage = {
  code: string;
  label: string;
  voiceName: string;
};

function toMonoChannel(audioBuffer: AudioBuffer): Float32Array {
  if (audioBuffer.numberOfChannels === 1) {
    return audioBuffer.getChannelData(0);
  }

  const mono = new Float32Array(audioBuffer.length);
  for (let c = 0; c < audioBuffer.numberOfChannels; c += 1) {
    const channel = audioBuffer.getChannelData(c);
    for (let i = 0; i < channel.length; i += 1) {
      mono[i] += channel[i] / audioBuffer.numberOfChannels;
    }
  }
  return mono;
}

function downsampleTo16k(source: Float32Array, sourceRate: number): Float32Array {
  const targetRate = 16000;
  if (sourceRate === targetRate) return source;

  const ratio = sourceRate / targetRate;
  const targetLength = Math.max(1, Math.round(source.length / ratio));
  const result = new Float32Array(targetLength);

  for (let i = 0; i < targetLength; i += 1) {
    const sourceIndex = i * ratio;
    const low = Math.floor(sourceIndex);
    const high = Math.min(source.length - 1, low + 1);
    const weight = sourceIndex - low;
    result[i] = source[low] * (1 - weight) + source[high] * weight;
  }

  return result;
}

function floatToInt16PCM(source: Float32Array): Int16Array {
  const pcm = new Int16Array(source.length);
  for (let i = 0; i < source.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, source[i]));
    pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return pcm;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function createWavBlobFromPcm(base64Pcm: string, sampleRate: number): Blob {
  const pcmBytes = base64ToBytes(base64Pcm);
  const wavBuffer = new ArrayBuffer(44 + pcmBytes.length);
  const view = new DataView(wavBuffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcmBytes.length, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, pcmBytes.length, true);

  new Uint8Array(wavBuffer, 44).set(pcmBytes);
  return new Blob([wavBuffer], { type: "audio/wav" });
}

function createPlayableAudioBlob(audioBase64: string, audioMimeType?: string): Blob {
  const normalizedMime = (audioMimeType ?? "").toLowerCase();
  const bytes = base64ToBytes(audioBase64);
  const bytesBuffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(bytesBuffer).set(bytes);

  if (normalizedMime.includes("wav")) {
    return new Blob([bytesBuffer], { type: "audio/wav" });
  }

  if (normalizedMime.startsWith("audio/") && !normalizedMime.includes("raw")) {
    return new Blob([bytesBuffer], { type: audioMimeType });
  }

  return createWavBlobFromPcm(audioBase64, 16000);
}

async function convertBlobToPcmBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new AudioContext();

  try {
    const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    const mono = toMonoChannel(decoded);
    const downsampled = downsampleTo16k(mono, decoded.sampleRate);
    const pcm = floatToInt16PCM(downsampled);
    return bytesToBase64(new Uint8Array(pcm.buffer));
  } finally {
    await audioContext.close();
  }
}

export function InteractiveVoiceWidget() {
  const [status, setStatus] = useState<WidgetState>("idle");
  const [callElapsedSeconds, setCallElapsedSeconds] = useState(0);
  const [isCallPanelOpen, setIsCallPanelOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceLanguageCode>(DEFAULT_VOICE_LANGUAGE);
  const [availableLanguages, setAvailableLanguages] = useState<SessionLanguage[]>(
    Object.entries(VOICE_CONFIG).map(([code, value]) => ({
      code,
      label: value.label,
      voiceName: value.name,
    })),
  );
  const [transcript, setTranscript] = useState("");
  const [assistantText, setAssistantText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [lastResponseAudio, setLastResponseAudio] = useState<ResponseAudioPayload | null>(null);
  const [sessionCostTotal, setSessionCostTotal] = useState(0);
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>("INR");
  const [agentMode, setAgentMode] = useState<AgentMode>("customer_support");
  const [customPrompt, setCustomPrompt] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioUrlRef = useRef<string | null>(null);
  const audioUnlockedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const lowPerfMode = isMobile || prefersReducedMotion;
  const canChangeLanguage = status === "idle" || status === "error";

  const statusLabel = useMemo(() => {
    if (status === "recording") return "Listening...";
    if (status === "processing") return "Thinking...";
    if (status === "playing") return "Speaking...";
    if (status === "error") return "Something went wrong";
    return "Ready to talk";
  }, [status]);
  const hasCompletedFirstReply = Boolean(lastResponseAudio || assistantText);
  const activeVoiceName = useMemo(
    () =>
      availableLanguages.find((item) => item.code === selectedLanguage)?.voiceName ?? "Voice Agent",
    [availableLanguages, selectedLanguage],
  );
  const formattedCallDuration = useMemo(() => {
    const minutes = Math.floor(callElapsedSeconds / 60);
    const seconds = callElapsedSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [callElapsedSeconds]);

  const usdToInrRate = Number(process.env.NEXT_PUBLIC_USD_TO_INR ?? "91");
  const toDisplayCurrency = (usdValue: number) =>
    displayCurrency === "INR" ? usdValue * usdToInrRate : usdValue;
  const formatMoney = (usdValue: number) => {
    const converted = toDisplayCurrency(usdValue);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: displayCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch("/api/voice/session");
        if (!res.ok) return;
        const payload = await res.json();
        if (Array.isArray(payload.languages) && payload.languages.length > 0) {
          setAvailableLanguages(payload.languages);
        }
        if (payload.defaults?.language && payload.defaults.language in VOICE_CONFIG) {
          setSelectedLanguage(payload.defaults.language as VoiceLanguageCode);
        }
      } catch {
        // keep fallback local config if session call fails
      }
    };
    void loadSession();
  }, []);

  useEffect(() => {
    if (status !== "recording" && status !== "processing" && status !== "playing") {
      return;
    }
    const id = window.setInterval(() => {
      setCallElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [status]);

  useEffect(() => {
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      if (activeAudioUrlRef.current) {
        URL.revokeObjectURL(activeAudioUrlRef.current);
      }
    };
  }, []);

  const stopPlayback = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
    }
    if (activeAudioUrlRef.current) {
      URL.revokeObjectURL(activeAudioUrlRef.current);
      activeAudioUrlRef.current = null;
    }
    setStatus("idle");
  };

  const unlockBrowserAudio = async () => {
    if (typeof window === "undefined" || audioUnlockedRef.current) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      if (audioContextRef.current.state !== "running") {
        await audioContextRef.current.resume();
      }

      // Tiny silent wav priming to satisfy stricter autoplay policies on some devices.
      const primer = new Audio(
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
      );
      primer.volume = 0.001;
      primer.preload = "auto";
      primer.setAttribute("playsinline", "true");
      await primer.play();
      primer.pause();
      primer.currentTime = 0;

      audioUnlockedRef.current = true;
    } catch {
      // Keep fallback UX ("Play response audio") for devices that still block.
    }
  };

  const playAssistantAudio = async (audioBase64: string, audioMimeType?: string) => {
    const audioBlob = createPlayableAudioBlob(audioBase64, audioMimeType);
    const audioUrl = URL.createObjectURL(audioBlob);

    if (activeAudioUrlRef.current) {
      URL.revokeObjectURL(activeAudioUrlRef.current);
    }
    activeAudioUrlRef.current = audioUrl;

    const audio = new Audio(audioUrl);
    audio.preload = "auto";
    audio.setAttribute("playsinline", "true");
    activeAudioRef.current = audio;
    setStatus("playing");

    await new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error("Failed to play assistant audio."));
      audio.play().catch(reject);
    });
  };

  const sendRecordedAudio = async (audioBlob: Blob) => {
    const audioBase64 = await convertBlobToPcmBase64(audioBlob);
    const response = await fetch("/api/voice/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: selectedLanguage,
        agentMode,
        customPrompt,
        audioBase64,
        conversation,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.details || payload?.error || "Voice request failed.");
    }

    const nextTranscript = String(payload.transcript ?? "");
    const nextAssistant = String(payload.assistantText ?? "");
    setTranscript(nextTranscript);
    setAssistantText(nextAssistant);
    setConversation((prev) => [
      ...prev.slice(-4),
      { role: "user", content: nextTranscript },
      { role: "assistant", content: nextAssistant },
    ]);

    const responseAudio = String(payload.audioBase64 ?? "");
    const responseAudioMime = String(payload.audioMimeType ?? "audio/raw;encoding=pcm_s16le;rate=16000");
    const estimatedCost = payload.estimatedCost as { totalUsd?: number } | undefined;
    if (estimatedCost && typeof estimatedCost.totalUsd === "number") {
      const turnCostUsd = estimatedCost.totalUsd;
      setSessionCostTotal((prev) => Number((prev + turnCostUsd).toFixed(6)));
    }
    if (responseAudio) {
      setLastResponseAudio({ audioBase64: responseAudio, audioMimeType: responseAudioMime });
      try {
        await playAssistantAudio(responseAudio, responseAudioMime);
      } catch (error) {
        const blockedByAutoplay =
          error instanceof DOMException && error.name === "NotAllowedError";
        setErrorMessage(
          blockedByAutoplay
            ? "Playback was blocked by your browser. Tap 'Play response audio' below."
            : error instanceof Error
              ? error.message
              : "Failed to play assistant audio.",
        );
      }
    }
    setStatus("idle");
  };

  const replayLastAudio = () => {
    if (!lastResponseAudio) return;
    setErrorMessage("");
    void unlockBrowserAudio()
      .then(() => playAssistantAudio(lastResponseAudio.audioBase64, lastResponseAudio.audioMimeType))
      .catch((error) => {
        const blockedByAutoplay = error instanceof DOMException && error.name === "NotAllowedError";
        setErrorMessage(
          blockedByAutoplay
            ? "Playback was blocked by your browser. Tap again to retry."
            : error instanceof Error
              ? error.message
              : "Failed to play assistant audio.",
        );
      })
      .finally(() => setStatus("idle"));
  };

  const finalizeRecording = async () => {
    try {
      const blobType = mediaRecorderRef.current?.mimeType || "audio/webm";
      const audioBlob = new Blob(recordedChunksRef.current, { type: blobType });
      recordedChunksRef.current = [];

      if (!audioBlob.size) {
        throw new Error("No audio captured. Please try again.");
      }
      await sendRecordedAudio(audioBlob);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to process audio.");
    } finally {
      mediaRecorderRef.current = null;
    }
  };

  const startRecording = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setErrorMessage("This browser does not support microphone capture.");
      return;
    }

    try {
      setErrorMessage("");
      setCallElapsedSeconds(0);
      setTranscript("");
      setAssistantText("");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });

      mediaStreamRef.current = stream;
      const mimeCandidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
      const supportedMimeType = mimeCandidates.find((mime) =>
        typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime),
      );
      const recorder = supportedMimeType
        ? new MediaRecorder(stream, { mimeType: supportedMimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        void finalizeRecording();
      };

      recorder.start(200);
      setStatus("recording");
    } catch (error) {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Microphone access denied. Please allow mic permissions.",
      );
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      return;
    }
    // This click is a strong user gesture; prime audio here so reply playback is less likely to be blocked.
    void unlockBrowserAudio();
    setStatus("processing");
    recorder.stop();
  };

  const onPrimaryAction = () => {
    if (status === "recording") {
      stopRecording();
      return;
    }
    if (status === "playing") {
      stopPlayback();
      return;
    }
    if (status === "idle" || status === "error") {
      void startRecording();
    }
  };

  useEffect(() => {
    const onStartDemo = () => {
      setIsCallPanelOpen(true);
      if (status === "idle" || status === "error") {
        onPrimaryAction();
      }
    };
    window.addEventListener("pranai:voice-demo-start", onStartDemo as EventListener);
    return () => window.removeEventListener("pranai:voice-demo-start", onStartDemo as EventListener);
  }, [status]);

  useEffect(() => {
    if (status === "recording" && callElapsedSeconds >= MAX_DEMO_CALL_SECONDS) {
      setErrorMessage("Demo calls are limited to 2 minutes. We stopped recording automatically.");
      stopRecording();
    }
  }, [callElapsedSeconds, status]);

  return (
    <motion.div
      layout={!lowPerfMode}
      initial={lowPerfMode ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        lowPerfMode ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20, delay: 0.1 }
      }
      className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-pran-orange/20 bg-white p-6 shadow-lg shadow-pran-orange/10 sm:p-8"
    >
      {!lowPerfMode && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pran-orange/5 blur-3xl mix-blend-multiply" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl" />
        </div>
      )}

      <div className="relative z-10">
        <motion.div layout={!lowPerfMode ? "position" : false} className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-pran-orange/25 bg-pran-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-pran-orange">
            <Zap className="h-3.5 w-3.5" />
            Live Demo
          </div>
          <h2 className="mb-2 text-3xl font-black tracking-tight text-primary sm:text-[2rem]">
            Talk To Your AI Agent In Seconds
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-secondary sm:text-[15px]">
            Pick a language and start talking. Your AI replies instantly in a natural voice.
          </p>
        </motion.div>

        <div className="mb-4">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-secondary">
              Language
            </label>
            <div className="group relative">
              <Globe2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-secondary transition group-focus-within:text-pran-orange" />
              <select
                value={selectedLanguage}
                disabled={!canChangeLanguage}
                onChange={(event) => setSelectedLanguage(event.target.value as VoiceLanguageCode)}
                className="w-full appearance-none rounded-xl border border-black/[0.08] bg-white py-2 pl-9 pr-9 text-sm font-medium text-primary shadow-sm outline-none transition focus:border-pran-orange/50 focus:ring-2 focus:ring-pran-orange/15 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {availableLanguages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label} - {item.voiceName}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-secondary transition group-focus-within:text-pran-orange" />
            </div>
          </div>
        </div>

        {!isCallPanelOpen ? (
          <div className="mb-6 mt-1 flex justify-center">
            <button
              id="live-voice-demo-action"
              type="button"
              onClick={() => {
                setIsCallPanelOpen(true);
                if (status === "idle" || status === "error") {
                  onPrimaryAction();
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-pran-orange px-6 py-3 text-sm font-bold text-white shadow-md shadow-pran-orange/20 transition-all hover:bg-pran-orange-light"
            >
              <Mic className="h-4 w-4" />
              Start Live Call
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 rounded-2xl border border-black/[0.08] bg-stone-50/70 px-3 py-3 sm:px-5 sm:py-5">
              <div className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <p className="text-sm font-semibold text-primary">{activeVoiceName}</p>
                  <p className="mt-0.5 text-xs text-secondary">{formattedCallDuration}</p>

                  <div className="mt-2 w-full max-w-[340px] sm:mt-3 sm:max-w-[430px]">
                    <motion.svg
                      viewBox="0 0 680 420"
                      className="h-20 w-full sm:h-28"
                      preserveAspectRatio="none"
                      animate={
                        status === "recording" || status === "playing"
                          ? { scaleY: [0.78, 1.24, 0.88], opacity: [0.48, 1, 0.8] }
                          : status === "processing"
                            ? { scaleY: [0.84, 1.1, 0.9], opacity: [0.4, 0.76, 0.4] }
                            : { scaleY: 0.74, opacity: 0.34 }
                      }
                      transition={{
                        repeat: status === "idle" ? 0 : Infinity,
                        duration: status === "processing" ? 2.1 : 1.8,
                        ease: "easeInOut",
                      }}
                    >
                      <defs>
                        <linearGradient id="voiceWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(234,88,12,0.15)" />
                          <stop offset="35%" stopColor="rgba(59,130,246,0.72)" />
                          <stop offset="65%" stopColor="rgba(168,85,247,0.68)" />
                          <stop offset="100%" stopColor="rgba(234,88,12,0.15)" />
                        </linearGradient>
                      </defs>
                      <motion.g
                        animate={
                          status === "recording" || status === "playing"
                            ? { x: [0, -34, 0], y: [0, -5, 0] }
                            : status === "processing"
                              ? { x: [0, -14, 0], y: [0, -2, 0] }
                              : { x: 0, y: 0 }
                        }
                        transition={{
                          repeat: status === "idle" ? 0 : Infinity,
                          duration: status === "processing" ? 3.9 : 3.1,
                          ease: "easeInOut",
                        }}
                      >
                        {Array.from({ length: 7 }).map((_, index) => (
                          <path
                            key={index}
                            d="M-120 210 C -40 18, 40 402, 120 210 C 200 18, 280 402, 360 210 C 440 18, 520 402, 600 210 C 680 18, 760 402, 840 210"
                            stroke="url(#voiceWaveGradient)"
                            strokeWidth={index < 2 ? 1.9 : 1.3}
                            fill="none"
                            opacity={0.16 + index * 0.09}
                            transform={`translate(0 ${index * 11 - 38})`}
                          />
                        ))}
                      </motion.g>
                      <motion.g
                        animate={
                          status === "recording" || status === "playing"
                            ? { x: [0, 26, 0], y: [0, 3.5, 0] }
                            : status === "processing"
                              ? { x: [0, 10, 0], y: [0, 2, 0] }
                              : { x: 0, y: 0 }
                        }
                        transition={{
                          repeat: status === "idle" ? 0 : Infinity,
                          duration: status === "processing" ? 3.4 : 2.8,
                          ease: "easeInOut",
                        }}
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <path
                            key={`b-${index}`}
                            d="M-130 210 C -35 56, 60 364, 155 210 C 250 56, 345 364, 440 210 C 535 56, 630 364, 725 210 C 820 56, 915 364, 1010 210"
                            stroke="url(#voiceWaveGradient)"
                            strokeWidth={1.1}
                            fill="none"
                            opacity={0.1 + index * 0.07}
                            transform={`translate(0 ${index * 12 - 30})`}
                          />
                        ))}
                      </motion.g>
                      <motion.g
                        animate={
                          status === "recording" || status === "playing"
                            ? { x: [0, -18, 0], y: [0, 2.5, 0] }
                            : status === "processing"
                              ? { x: [0, -7, 0], y: [0, 1, 0] }
                              : { x: 0, y: 0 }
                        }
                        transition={{
                          repeat: status === "idle" ? 0 : Infinity,
                          duration: status === "processing" ? 3.1 : 2.5,
                          ease: "easeInOut",
                        }}
                      >
                        {Array.from({ length: 3 }).map((_, index) => (
                          <path
                            key={`c-${index}`}
                            d="M-130 210 C -45 80, 40 340, 125 210 C 210 80, 295 340, 380 210 C 465 80, 550 340, 635 210 C 720 80, 805 340, 890 210"
                            stroke="url(#voiceWaveGradient)"
                            strokeWidth={0.95}
                            fill="none"
                            opacity={0.18 + index * 0.05}
                            transform={`translate(0 ${index * 14 - 12})`}
                          />
                        ))}
                      </motion.g>
                    </motion.svg>
                  </div>

                  <motion.button
                    id="live-voice-demo-action"
                    type="button"
                    onClick={onPrimaryAction}
                    disabled={status === "processing"}
                    whileTap={status === "processing" ? undefined : { scale: 0.96 }}
                    className={`mt-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-all ${
                      status === "recording"
                        ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
                        : status === "playing"
                          ? "bg-zinc-800 hover:bg-black shadow-black/25"
                          : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
                    } ${status === "processing" ? "cursor-not-allowed opacity-80" : ""}`}
                  >
                    {status === "recording" ? (
                      <Square className="h-3.5 w-3.5 fill-current" />
                    ) : status === "processing" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : status === "playing" ? (
                      <Volume2 className="h-3.5 w-3.5" />
                    ) : (
                      <Mic className="h-3.5 w-3.5" />
                    )}
                  </motion.button>

                  <div className="mt-2 flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[10px] text-primary shadow-sm">
                    {status === "processing" ? (
                      <Loader2 className="h-2.5 w-2.5 animate-spin text-pran-orange" />
                    ) : status === "playing" ? (
                      <Volume2 className="h-2.5 w-2.5 text-pran-orange" />
                    ) : (
                      <Sparkles className="h-2.5 w-2.5 text-pran-orange" />
                    )}
                    {statusLabel}
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {errorMessage}
              </p>
            )}
          </>
        )}

        <p className="mt-1 text-center text-xs text-secondary">
          No signup required • Typical first response under 1 second
        </p>

        <details className="mt-4 rounded-xl border border-black/[0.08] bg-white p-3">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-secondary">
                Advanced Settings
              </summary>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-secondary">
                    AI Agent
                  </label>
                  <div className="group relative">
                    <Bot className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-secondary transition group-focus-within:text-pran-orange" />
                    <select
                      value={agentMode}
                      disabled={!canChangeLanguage}
                      onChange={(event) => setAgentMode(event.target.value as AgentMode)}
                      className="w-full appearance-none rounded-xl border border-black/[0.08] bg-white py-2 pl-9 pr-9 text-sm text-primary shadow-sm outline-none transition focus:border-pran-orange/50 focus:ring-2 focus:ring-pran-orange/15 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {AGENT_MODE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-secondary transition group-focus-within:text-pran-orange" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-secondary">
                    Business Context (Optional)
                  </label>
                  <textarea
                    value={customPrompt}
                    disabled={!canChangeLanguage}
                    onChange={(event) => setCustomPrompt(event.target.value)}
                    rows={2}
                    maxLength={1200}
                    placeholder="Add your business context. This is appended to the default agent prompt."
                    className="w-full resize-y rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-primary outline-none transition focus:border-pran-orange/50"
                  />
                </div>

                {hasCompletedFirstReply && (
                  <div className="rounded-xl border border-black/[0.08] bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-pran-orange" />
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">
                          Estimated Product Usage Cost
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-full border border-black/[0.08] bg-stone-50 p-0.5">
                          <button
                            type="button"
                            onClick={() => setDisplayCurrency("INR")}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
                              displayCurrency === "INR"
                                ? "bg-white text-primary shadow-sm"
                                : "text-secondary"
                            }`}
                          >
                            INR
                          </button>
                          <button
                            type="button"
                            onClick={() => setDisplayCurrency("USD")}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
                              displayCurrency === "USD"
                                ? "bg-white text-primary shadow-sm"
                                : "text-secondary"
                            }`}
                          >
                            USD
                          </button>
                        </div>
                        <p className="text-lg font-extrabold text-primary">{formatMoney(sessionCostTotal)}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] text-secondary">
                      Demo estimator only. This shows modeled usage cost if this agent were deployed in your product.
                    </p>
                  </div>
                )}
              </div>
        </details>

        {lastResponseAudio && status !== "recording" && status !== "processing" && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={replayLastAudio}
              className="rounded-full border border-black/[0.1] bg-white px-4 py-2 text-xs font-semibold text-primary transition hover:bg-stone-50"
            >
              Play response audio
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
}
