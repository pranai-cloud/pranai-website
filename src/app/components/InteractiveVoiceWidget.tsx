"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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

  const usdToInrRate = Number(process.env.NEXT_PUBLIC_USD_TO_INR ?? "83");
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

  const playAssistantAudio = async (audioBase64: string, audioMimeType?: string) => {
    const audioBlob = createPlayableAudioBlob(audioBase64, audioMimeType);
    const audioUrl = URL.createObjectURL(audioBlob);

    if (activeAudioUrlRef.current) {
      URL.revokeObjectURL(activeAudioUrlRef.current);
    }
    activeAudioUrlRef.current = audioUrl;

    const audio = new Audio(audioUrl);
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
    void playAssistantAudio(lastResponseAudio.audioBase64, lastResponseAudio.audioMimeType)
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
      setStatus("recording");
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

  return (
    <motion.div
      layout={!lowPerfMode}
      initial={lowPerfMode ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        lowPerfMode ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20, delay: 0.1 }
      }
      className="relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8"
    >
      {!lowPerfMode && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pran-orange/5 blur-3xl mix-blend-multiply" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl" />
        </div>
      )}

      <div className="relative z-10">
        <motion.div layout={!lowPerfMode ? "position" : false} className="mb-4 text-center">
          <h3 className="mb-1 text-2xl font-bold tracking-tight text-primary">
            Talk To Your AI Agent In Seconds
          </h3>
          <p className="mx-auto max-w-sm text-sm text-secondary">
            Pick a language, speak naturally, hear the response, and watch real-time cost.
          </p>
        </motion.div>

        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
        </div>

        <details className="mb-4 rounded-xl border border-black/[0.08] bg-white p-3">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-secondary">
            Add Business Context (Optional)
          </summary>
          <div className="mt-3">
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
        </details>

        <AnimatePresence mode="wait">
          {(status === "recording" || status === "playing") && (
            <motion.div
              key="waveform"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="mb-4 flex h-6 items-center justify-center gap-1.5 opacity-80"
            >
              {Array.from({ length: lowPerfMode ? 4 : 7 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="w-1.5 rounded-full bg-pran-orange"
                  initial={{ height: "20%" }}
                  animate={
                    lowPerfMode
                      ? { height: ["20%", "60%", "20%"] }
                      : { height: ["20%", `${Math.random() * 80 + 20}%`, "20%"] }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: lowPerfMode ? 1 : 0.45 + Math.random() * 0.35,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout={!lowPerfMode ? "position" : false}
          className="mb-4 flex items-center justify-between rounded-xl border border-black/[0.08] bg-stone-50 px-4 py-3"
        >
          <p className="text-sm font-medium text-primary">{statusLabel}</p>
          {status === "processing" ? (
            <Loader2 className="h-4 w-4 animate-spin text-pran-orange" />
          ) : status === "playing" ? (
            <Volume2 className="h-4 w-4 text-pran-orange" />
          ) : (
            <Sparkles className="h-4 w-4 text-pran-orange" />
          )}
        </motion.div>

        <div className="mb-4 rounded-xl border border-black/[0.08] bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-pran-orange" />
              <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">Live Cost Meter</p>
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
          <p className="mt-2 text-[11px] text-secondary">Package-estimated pricing updates after each reply.</p>
        </div>

        {errorMessage && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </p>
        )}

        <motion.div layout={!lowPerfMode ? "position" : false} className="flex justify-center">
          <button
            type="button"
            onClick={onPrimaryAction}
            disabled={status === "processing"}
            className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 font-bold tracking-wide text-white transition-all shadow-md ${
              status === "recording"
                ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                : status === "playing"
                  ? "bg-zinc-800 hover:bg-black shadow-black/20"
                  : "bg-pran-orange hover:bg-pran-orange-light shadow-pran-orange/20"
            } ${status === "processing" ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {status === "recording" ? (
              <>
                <Square className="h-4 w-4 fill-current" />
                Stop Recording
              </>
            ) : status === "processing" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : status === "playing" ? (
              <>
                <Volume2 className="h-5 w-5" />
                Stop Playback
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Start Talking Now
              </>
            )}
          </button>
        </motion.div>

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

        {(transcript || assistantText) && (
          <div className="mt-5 space-y-2">
            {transcript && (
              <div className="rounded-xl border border-black/[0.08] bg-white px-4 py-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-secondary">You said</p>
                <p className="text-sm text-primary">{transcript}</p>
              </div>
            )}
            {assistantText && (
              <div className="rounded-xl border border-pran-orange/20 bg-pran-orange/5 px-4 py-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-pran-orange">PranAI</p>
                <p className="text-sm text-primary">{assistantText}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
