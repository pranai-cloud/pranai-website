require("dotenv").config({ path: ".env.local" });
/* eslint-disable no-console */
const http = require("http");
const crypto = require("crypto");
const { WebSocketServer, WebSocket } = require("ws");

const PORT = Number(process.env.PORT || 8080);
const PROTOCOL_VERSION = "1";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY;

const CARTESIA_VERSION = process.env.CARTESIA_VERSION || "2025-04-16";
const CARTESIA_MODEL_ID = process.env.CARTESIA_MODEL_ID || "sonic-multilingual";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const VOICE_CONFIG = {
  en: { voiceId: "e8e5fffb-252c-436d-b842-8879b84445b6", label: "English", sttLang: "en", gender: "feminine" },
  hi: { voiceId: "28ca2041-5dda-42df-8123-f58ea9c3da00", label: "Hindi", sttLang: "hi", gender: "feminine" },
  te: { voiceId: "07bc462a-c644-49f1-baf7-82d5599131be", label: "Telugu", sttLang: "te", gender: "feminine" },
  kn: { voiceId: "7c6219d2-e8d2-462c-89d8-7ecba7c75d65", label: "Kannada", sttLang: "kn", gender: "feminine" },
  mr: { voiceId: "5c32dce6-936a-4892-b131-bafe474afe5f", label: "Marathi", sttLang: "mr", gender: "masculine" },
  bn: { voiceId: "2ba861ea-7cdc-43d1-8608-4045b5a41de5", label: "Bengali", sttLang: "bn", gender: "masculine" },
};

const AGENT_MODE_PROMPTS = {
  customer_support:
    "You are in Customer Support mode for pran.ai deployments. Resolve issues quickly and give clear next steps.",
  lead_qualification:
    "You are in Lead Qualification mode for pran.ai. Qualify fit by use case, volume, integrations, and timeline.",
  receptionist:
    "You are in Receptionist mode for pran.ai. Greet, route, and collect essential details cleanly.",
  cart_recovery:
    "You are in Cart Recovery mode for pran.ai commerce flows. Handle objections and guide completion without being pushy.",
};

const NOVA_2_LANGUAGE_CODES = new Set(["en", "hi"]);
const MAX_HISTORY_MESSAGES = Number(process.env.VOICE_FAST_HISTORY_MESSAGES || 4);
const GROQ_MAX_TOKENS = Number(process.env.VOICE_FAST_MAX_TOKENS || 90);
const GROQ_TEMPERATURE = Number(process.env.VOICE_FAST_TEMPERATURE || 0.4);
const MAX_DEEPGRAM_RECONNECT_ATTEMPTS = Number(process.env.DEEPGRAM_RECONNECT_ATTEMPTS || 6);
const VOICE_COST_STT_PER_MIN_USD = Number(process.env.VOICE_COST_STT_PER_MIN_USD || 0.0043);
const VOICE_COST_LLM_PROMPT_PER_1K_USD = Number(process.env.VOICE_COST_LLM_PROMPT_PER_1K_USD || 0.0006);
const VOICE_COST_LLM_COMPLETION_PER_1K_USD = Number(process.env.VOICE_COST_LLM_COMPLETION_PER_1K_USD || 0.0012);
const VOICE_COST_TTS_PER_SEC_USD = Number(process.env.VOICE_COST_TTS_PER_SEC_USD || 0.0002);
const VOICE_COST_ESTIMATE_MULTIPLIER = Number(process.env.VOICE_COST_ESTIMATE_MULTIPLIER || 0.75);

const BASE_SYSTEM_PROMPT =
  "You are the PranAI Voice Assistant. Be concise and natural for speech, 1-2 short sentences by default. Never correct user pronunciation/spelling of the brand unless user explicitly asks.";
const PRODUCT_CONTEXT_PROMPT =
  "pran.ai helps businesses deploy multilingual AI voice/chat agents for support, lead qualification, receptionist flows, and cart recovery. Explain pricing as package-estimated and focus on ROI and practical integration strategies. Do not proactively explain brand pronunciation.";

if (!DEEPGRAM_API_KEY || !GROQ_API_KEY || !CARTESIA_API_KEY) {
  console.error("Missing DEEPGRAM_API_KEY, GROQ_API_KEY, or CARTESIA_API_KEY.");
  process.exit(1);
}

function safeJsonParse(input) {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function sendJson(ws, payload) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function nowMs() {
  return Date.now();
}

function roundUsd(value) {
  return Number(value.toFixed(6));
}

function estimateTurnCostUsd({
  sttAudioSeconds,
  completionChars,
  outputAudioBytes,
}) {
  const promptTokensEstimate = 120;
  const completionTokensEstimate = Math.max(1, Math.round(completionChars / 4));
  const outputAudioSeconds = outputAudioBytes / (16000 * 2);

  const sttUsd = (sttAudioSeconds / 60) * VOICE_COST_STT_PER_MIN_USD;
  const llmUsd =
    (promptTokensEstimate / 1000) * VOICE_COST_LLM_PROMPT_PER_1K_USD +
    (completionTokensEstimate / 1000) * VOICE_COST_LLM_COMPLETION_PER_1K_USD;
  const ttsUsd = outputAudioSeconds * VOICE_COST_TTS_PER_SEC_USD;

  const factor = Number.isFinite(VOICE_COST_ESTIMATE_MULTIPLIER) && VOICE_COST_ESTIMATE_MULTIPLIER > 0
    ? VOICE_COST_ESTIMATE_MULTIPLIER
    : 0.75;

  const adjusted = {
    sttUsd: sttUsd * factor,
    llmUsd: llmUsd * factor,
    ttsUsd: ttsUsd * factor,
  };

  return {
    sttUsd: roundUsd(adjusted.sttUsd),
    llmUsd: roundUsd(adjusted.llmUsd),
    ttsUsd: roundUsd(adjusted.ttsUsd),
    totalUsd: roundUsd(adjusted.sttUsd + adjusted.llmUsd + adjusted.ttsUsd),
    inputAudioSeconds: Number(sttAudioSeconds.toFixed(2)),
    outputAudioSeconds: Number(outputAudioSeconds.toFixed(2)),
    promptTokens: promptTokensEstimate,
    completionTokens: completionTokensEstimate,
  };
}

function sanitizeLanguage(input) {
  return input && VOICE_CONFIG[input] ? input : "en";
}

function sanitizeAgentMode(input) {
  return input && AGENT_MODE_PROMPTS[input] ? input : "customer_support";
}

function sanitizeCustomPrompt(input) {
  if (!input || typeof input !== "string") return "";
  return input.trim().slice(0, 600);
}

function enforceHindiFeminineFirstPerson(text) {
  let out = text;
  out = out.replace(/\bमैं\s+कर\s+सकता\s+हूं\b/gi, "मैं कर सकती हूँ");
  out = out.replace(/\bमैं\s+कर\s+सकता\s+हूँ\b/gi, "मैं कर सकती हूँ");
  out = out.replace(/\bमैं\s+कर\s+सकता\b/gi, "मैं कर सकती");
  out = out.replace(/\bmain\s+kar\s+sakta\s+hoon\b/gi, "main kar sakti hoon");
  out = out.replace(/\bmain\s+kar\s+sakta\s+hun\b/gi, "main kar sakti hoon");
  out = out.replace(/\bमैं\s+गया\s+था\b/gi, "मैं गई थी");
  out = out.replace(/\bmain\s+gaya\s+tha\b/gi, "main gayi thi");
  out = out.replace(/\bमैं\s+समझता\s+हूं\b/gi, "मैं समझती हूँ");
  out = out.replace(/\bमैं\s+समझता\s+हूँ\b/gi, "मैं समझती हूँ");
  out = out.replace(/\bmain\s+samajhta\s+hoon\b/gi, "main samajhti hoon");
  return out;
}

function shouldEndCallFromUserText(input) {
  if (!input || typeof input !== "string") return false;
  const text = input.toLowerCase().trim();
  if (!text) return false;

  const endCallPatterns = [
    /\bbye\b/,
    /\bgoodbye\b/,
    /\bbye[- ]?bye\b/,
    /\bhang up\b/,
    /\blet'?s hang up\b/,
    /\bend (the )?call\b/,
    /\bdisconnect\b/,
    /\bstop (the )?call\b/,
    /\bcall over\b/,
    /\bthat'?s all\b/,
    /\bthank you(?:\s+bye)?\b/,
    /\bok(?:ay)?\s+bye\b/,
    /मुझे कॉल (बंद|खत्म) करनी है/,
    /कॉल (बंद|खत्म) (करो|कर दीजिए)/,
    /ठीक है\s*बाय/,
  ];

  return endCallPatterns.some((pattern) => pattern.test(text));
}

function createDeepgramUrl(languageCode) {
  const stt = VOICE_CONFIG[languageCode] ?? VOICE_CONFIG.en;
  const model = NOVA_2_LANGUAGE_CODES.has(languageCode) ? "nova-2" : "nova-3";
  const params = new URLSearchParams({
    model,
    language: stt.sttLang,
    encoding: "linear16",
    sample_rate: "16000",
    interim_results: "true",
    punctuate: "true",
    smart_format: "true",
    vad_events: "true",
    endpointing: "300",
  });
  return `wss://api.deepgram.com/v1/listen?${params.toString()}`;
}

function createCartesiaUrl() {
  const params = new URLSearchParams({
    api_key: CARTESIA_API_KEY,
    cartesia_version: CARTESIA_VERSION,
  });
  return `wss://api.cartesia.ai/tts/websocket?${params.toString()}`;
}

async function* streamGroqTokens(messages) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      stream: true,
      temperature: GROQ_TEMPERATURE,
      max_tokens: GROQ_MAX_TOKENS,
      messages,
    }),
  });

  if (!response.ok || !response.body) {
    const details = await response.text().catch(() => "Unable to read error body.");
    throw new Error(`Groq stream failed (${response.status}): ${details.slice(0, 500)}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      for (const line of event.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (!data || data === "[DONE]") continue;

        const json = safeJsonParse(data);
        const delta = json?.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta.length > 0) {
          yield delta;
        }
      }
    }
  }
}

async function waitForOpen(ws, timeoutMs = 8000) {
  if (ws.readyState === WebSocket.OPEN) return;
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("WebSocket open timeout.")), timeoutMs);
    const onOpen = () => {
      clearTimeout(timeout);
      ws.off("error", onError);
      resolve();
    };
    const onError = (error) => {
      clearTimeout(timeout);
      ws.off("open", onOpen);
      reject(error);
    };
    ws.once("open", onOpen);
    ws.once("error", onError);
  });
}

const httpServer = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

wss.on("connection", (clientWs) => {
  const session = {
    language: "en",
    agentMode: "customer_support",
    customPrompt: "",
    conversation: [],
    deepgramWs: null,
    deepgramKeepAlive: null,
    cartesiaWs: null,
    activeGenerationId: 0,
    activeContextId: null,
    isAssistantSpeaking: false,
    closed: false,
    initialized: false,
    expectDeepgramClose: false,
    deepgramReconnectAttempts: 0,
    deepgramReconnectTimer: null,
    lastDeepgramErrorMessage: "",
    turnMetricsByContext: new Map(),
  };

  function cleanup() {
    session.closed = true;
    if (session.deepgramKeepAlive) clearInterval(session.deepgramKeepAlive);
    session.deepgramKeepAlive = null;
    if (session.deepgramReconnectTimer) clearTimeout(session.deepgramReconnectTimer);
    session.deepgramReconnectTimer = null;
    session.expectDeepgramClose = true;

    if (session.deepgramWs && session.deepgramWs.readyState === WebSocket.OPEN) {
      session.deepgramWs.send(JSON.stringify({ type: "CloseStream" }));
      session.deepgramWs.close();
    }
    if (session.cartesiaWs && session.cartesiaWs.readyState === WebSocket.OPEN) {
      session.cartesiaWs.close();
    }
  }

  function resetCurrentGeneration(reason = "barge_in") {
    session.activeGenerationId += 1;
    session.isAssistantSpeaking = false;
    const contextToCancel = session.activeContextId;
    session.activeContextId = null;
    session.conversation = [];
    if (contextToCancel) {
      session.turnMetricsByContext.delete(contextToCancel);
    }

    if (session.cartesiaWs?.readyState === WebSocket.OPEN && contextToCancel) {
      session.cartesiaWs.send(
        JSON.stringify({
          context_id: contextToCancel,
          cancel: true,
        }),
      );
    }

    sendJson(clientWs, { type: "assistant_interrupted", reason });
    sendJson(clientWs, { type: "assistant_audio_clear" });
  }

  async function ensureCartesiaConnection() {
    if (session.cartesiaWs && session.cartesiaWs.readyState === WebSocket.OPEN) return;
    if (session.cartesiaWs && session.cartesiaWs.readyState === WebSocket.CONNECTING) {
      await waitForOpen(session.cartesiaWs);
      return;
    }

    let lastError = null;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      session.cartesiaWs = new WebSocket(createCartesiaUrl(), {
        headers: {
          "Cartesia-Version": CARTESIA_VERSION,
        },
      });

      session.cartesiaWs.on("message", (raw) => {
        const msg = safeJsonParse(raw.toString());
        if (!msg) return;

      const audioBase64 =
        msg.data ||
        msg.audio ||
        msg.audio_base64 ||
        msg.chunk ||
        msg.bytes ||
        null;

      if (typeof audioBase64 === "string" && audioBase64.length > 0) {
        const contextId = msg.context_id || session.activeContextId;
        if (contextId) {
          const metrics = session.turnMetricsByContext.get(contextId);
          if (metrics && !metrics.firstTtsAudioChunkAt) {
            metrics.firstTtsAudioChunkAt = nowMs();
          }
          if (metrics) {
            metrics.outputAudioBytes += Buffer.from(audioBase64, "base64").byteLength;
          }
        }
        sendJson(clientWs, {
          type: "assistant_audio_chunk",
          contextId,
          audioBase64,
          audioMimeType: "audio/raw;encoding=pcm_s16le;rate=16000",
        });
      }

      if (msg.done === true) {
        session.isAssistantSpeaking = false;
        const contextId = msg.context_id || null;
        const metrics = contextId ? session.turnMetricsByContext.get(contextId) : null;
        if (metrics) {
          metrics.completedAt = nowMs();
          const estimatedCost = estimateTurnCostUsd({
            sttAudioSeconds: metrics.sttAudioSeconds || 0,
            completionChars: metrics.assistantChars || 0,
            outputAudioBytes: metrics.outputAudioBytes || 0,
          });
          sendJson(clientWs, {
            type: "metrics_turn",
            contextId,
            ...metrics,
            totalMs: metrics.completedAt - metrics.startedAt,
            groqFirstTokenMs: metrics.firstGroqTokenAt
              ? metrics.firstGroqTokenAt - metrics.startedAt
              : null,
            ttsFirstAudioMs: metrics.firstTtsAudioChunkAt
              ? metrics.firstTtsAudioChunkAt - metrics.startedAt
              : null,
            estimatedCost,
          });
          session.turnMetricsByContext.delete(contextId);
        }
        sendJson(clientWs, { type: "assistant_audio_done", contextId });
      }

      if (msg.error) {
        const errorText = String(msg.error);
        const expectedAfterCancel = /Invalid context ID/i.test(errorText);
        if (!expectedAfterCancel) {
          sendJson(clientWs, { type: "error", error: `Cartesia error: ${errorText}` });
        }
      }
      });

      session.cartesiaWs.on("close", () => {
        session.cartesiaWs = null;
      });

      session.cartesiaWs.on("error", (error) => {
        lastError = error;
      });

      try {
        await waitForOpen(session.cartesiaWs);
        return;
      } catch (error) {
        lastError = error;
        session.cartesiaWs = null;
        if (attempt === 2) break;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error("Unable to connect to Cartesia websocket.");
  }

  async function sendTextChunkToCartesia({ contextId, transcript, continueStream }) {
    await ensureCartesiaConnection();
    if (!session.cartesiaWs || session.cartesiaWs.readyState !== WebSocket.OPEN) return;

    const voiceId = (VOICE_CONFIG[session.language] || VOICE_CONFIG.en).voiceId;

    session.cartesiaWs.send(
      JSON.stringify({
        model_id: CARTESIA_MODEL_ID,
        context_id: contextId,
        transcript,
        continue: continueStream,
        language: session.language,
        voice: {
          mode: "id",
          id: voiceId,
        },
        output_format: {
          container: "raw",
          encoding: "pcm_s16le",
          sample_rate: 16000,
        },
      }),
    );
  }

  async function handleFinalTranscript(transcript, sttDurationSec = 0) {
    const generationId = ++session.activeGenerationId;
    const contextId = crypto.randomUUID();

    session.activeContextId = contextId;
    session.isAssistantSpeaking = true;
    session.turnMetricsByContext.set(contextId, {
      startedAt: nowMs(),
      firstGroqTokenAt: null,
      firstTtsAudioChunkAt: null,
      completedAt: null,
      sttAudioSeconds: Number.isFinite(sttDurationSec) ? sttDurationSec : 0,
      outputAudioBytes: 0,
      assistantChars: 0,
    });
    session.conversation.push({ role: "user", content: transcript });
    session.conversation = session.conversation.slice(-8);

    const systemPrompt = process.env.VOICE_AGENT_SYSTEM_PROMPT || BASE_SYSTEM_PROMPT;
    const modePrompt = AGENT_MODE_PROMPTS[session.agentMode] || AGENT_MODE_PROMPTS.customer_support;
    const voiceEntry = VOICE_CONFIG[session.language] || VOICE_CONFIG.en;
    const languageLabel = voiceEntry.label;
    const voiceGender = voiceEntry.gender;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: PRODUCT_CONTEXT_PROMPT },
      { role: "system", content: modePrompt },
      ...(session.customPrompt
        ? [{ role: "system", content: `Additional business context from user: ${session.customPrompt}` }]
        : []),
      {
        role: "system",
        content: `Selected response language is ${languageLabel}. Keep replies short and speech-friendly.`,
      },
      {
        role: "system",
        content:
          `Voice gender presentation is ${voiceGender}. In gendered languages, ALWAYS use first-person forms matching this gender and never switch. ` +
          "For Hindi/Hinglish feminine voice, always use feminine forms like 'मैं कर सकती हूँ', 'main kar sakti hoon', 'मैं गई थी'. Never use masculine forms like 'कर सकता हूँ' or 'मैं गया था'.",
      },
      ...session.conversation.slice(-Math.max(0, MAX_HISTORY_MESSAGES)),
      { role: "user", content: transcript },
    ];

    sendJson(clientWs, { type: "assistant_response_start", contextId });

    let assistantText = "";
    let tokenBuffer = "";
    let wroteAnyChunk = false;

    try {
      for await (const token of streamGroqTokens(messages)) {
        if (session.closed || generationId !== session.activeGenerationId) {
          return;
        }

        assistantText += token;
        tokenBuffer += token;
        const metrics = session.turnMetricsByContext.get(contextId);
        if (metrics && !metrics.firstGroqTokenAt) {
          metrics.firstGroqTokenAt = nowMs();
        }
        if (metrics) metrics.assistantChars = assistantText.length;
        sendJson(clientWs, { type: "assistant_text_delta", delta: token, contextId });

        const shouldFlush =
          /[.!?]\s*$/.test(tokenBuffer) ||
          tokenBuffer.length >= 48 ||
          token.includes("\n");

        if (shouldFlush) {
          const ttsChunk =
            session.language === "hi" ? enforceHindiFeminineFirstPerson(tokenBuffer) : tokenBuffer;
          await sendTextChunkToCartesia({
            contextId,
            transcript: ttsChunk,
            continueStream: true,
          });
          wroteAnyChunk = true;
          tokenBuffer = "";
        }
      }

      if (session.closed || generationId !== session.activeGenerationId) return;

      if (tokenBuffer.length > 0) {
        const ttsChunk = session.language === "hi" ? enforceHindiFeminineFirstPerson(tokenBuffer) : tokenBuffer;
        await sendTextChunkToCartesia({
          contextId,
          transcript: ttsChunk,
          continueStream: true,
        });
        wroteAnyChunk = true;
      }

      await sendTextChunkToCartesia({
        contextId,
        transcript: "",
        continueStream: false,
      });

      if (assistantText.trim().length > 0) {
        session.conversation.push({ role: "assistant", content: assistantText.trim() });
        session.conversation = session.conversation.slice(-8);
      }

      sendJson(clientWs, {
        type: "assistant_text_final",
        text: assistantText.trim(),
        contextId,
        wroteAudio: wroteAnyChunk,
      });
    } catch (error) {
      session.isAssistantSpeaking = false;
      session.turnMetricsByContext.delete(contextId);
      sendJson(clientWs, {
        type: "error",
        error: error instanceof Error ? error.message : "LLM/TTS stream failed.",
      });
    }
  }

  function connectDeepgram() {
    if (session.deepgramReconnectTimer) {
      clearTimeout(session.deepgramReconnectTimer);
      session.deepgramReconnectTimer = null;
    }
    if (session.deepgramWs && session.deepgramWs.readyState === WebSocket.OPEN) {
      session.expectDeepgramClose = true;
      session.deepgramWs.send(JSON.stringify({ type: "CloseStream" }));
      session.deepgramWs.close();
    }

    const deepgramUrl = createDeepgramUrl(session.language);
    console.log(`[voice] connecting deepgram language=${session.language} url=${deepgramUrl}`);
    session.expectDeepgramClose = false;
    session.lastDeepgramErrorMessage = "";
    session.deepgramWs = new WebSocket(deepgramUrl, {
      headers: {
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
      },
    });

    session.deepgramWs.on("open", () => {
      console.log(`[voice] deepgram connected language=${session.language}`);
      session.deepgramReconnectAttempts = 0;
      sendJson(clientWs, { type: "stt_ready", language: session.language });
      if (session.deepgramKeepAlive) clearInterval(session.deepgramKeepAlive);
      session.deepgramKeepAlive = setInterval(() => {
        if (session.deepgramWs?.readyState === WebSocket.OPEN) {
          session.deepgramWs.send(JSON.stringify({ type: "KeepAlive" }));
        }
      }, 5000);
    });

    session.deepgramWs.on("message", (raw) => {
      const msg = safeJsonParse(raw.toString());
      if (!msg) return;

      if (msg.type === "SpeechStarted") {
        sendJson(clientWs, { type: "speech_started" });
        if (session.isAssistantSpeaking) {
          resetCurrentGeneration("user_barge_in");
        }
        return;
      }

      if (msg.type !== "Results") return;

      const transcript = msg.channel?.alternatives?.[0]?.transcript?.trim() || "";
      if (!transcript) return;

      if (!msg.is_final) {
        sendJson(clientWs, { type: "transcript_interim", transcript });
        return;
      }

      sendJson(clientWs, { type: "transcript_final", transcript });
      if (shouldEndCallFromUserText(transcript)) {
        resetCurrentGeneration("user_requested_end");
        sendJson(clientWs, {
          type: "session_end_intent",
          reason: "user_requested_end",
          transcript,
        });
        return;
      }
      void handleFinalTranscript(transcript, Number(msg.duration || 0));
    });

    session.deepgramWs.on("close", () => {
      console.log(
        `[voice] deepgram closed expected=${session.expectDeepgramClose} err=${session.lastDeepgramErrorMessage || "none"}`,
      );
      sendJson(clientWs, { type: "stt_closed" });
      if (session.deepgramKeepAlive) {
        clearInterval(session.deepgramKeepAlive);
        session.deepgramKeepAlive = null;
      }
      if (session.closed || session.expectDeepgramClose) return;

      const nonRetryable =
        /401|403|400|Unauthorized|Forbidden|Bad Request|model\/language\/tier/i.test(
          session.lastDeepgramErrorMessage || "",
        );
      if (nonRetryable) {
        sendJson(clientWs, {
          type: "error",
          error: `Deepgram connection failed: ${session.lastDeepgramErrorMessage}`,
        });
        return;
      }

      if (session.deepgramReconnectAttempts >= MAX_DEEPGRAM_RECONNECT_ATTEMPTS) {
        sendJson(clientWs, { type: "error", error: "STT connection dropped repeatedly. Please restart call." });
        return;
      }
      const attempt = ++session.deepgramReconnectAttempts;
      const delayMs = Math.min(1000 * 2 ** (attempt - 1), 7000);
      sendJson(clientWs, { type: "stt_reconnecting", attempt, delayMs });
      session.deepgramReconnectTimer = setTimeout(() => {
        if (!session.closed) connectDeepgram();
      }, delayMs);
    });

    session.deepgramWs.on("error", (error) => {
      session.lastDeepgramErrorMessage = error.message;
      console.log(`[voice] deepgram error ${error.message}`);
      sendJson(clientWs, { type: "error", error: `Deepgram WS error: ${error.message}` });
    });
  }

  clientWs.on("message", (data, isBinary) => {
    if (isBinary) {
      if (session.deepgramWs?.readyState === WebSocket.OPEN) {
        session.deepgramWs.send(data);
      }
      return;
    }

    const msg = safeJsonParse(data.toString());
    if (!msg?.type) return;
    if (!session.initialized && msg.type !== "init") {
      sendJson(clientWs, { type: "error", error: "Send init before other message types." });
      return;
    }

    if (msg.type === "init") {
      const protocolVersion =
        typeof msg.protocolVersion === "string" ? msg.protocolVersion : String(msg.protocolVersion || "");
      if (protocolVersion !== PROTOCOL_VERSION) {
        sendJson(clientWs, {
          type: "error",
          error: `Protocol version mismatch. Client=${protocolVersion || "none"}, server=${PROTOCOL_VERSION}.`,
        });
        clientWs.close();
        return;
      }
      session.initialized = true;
      session.language = sanitizeLanguage(msg.language);
      session.agentMode = sanitizeAgentMode(msg.agentMode);
      session.customPrompt = sanitizeCustomPrompt(msg.customPrompt);
      session.conversation = [];
      connectDeepgram();
      sendJson(clientWs, {
        type: "ready",
        protocolVersion: PROTOCOL_VERSION,
        language: session.language,
        supportedLanguages: Object.keys(VOICE_CONFIG),
      });
      return;
    }

    if (msg.type === "config") {
      const nextLanguage = sanitizeLanguage(msg.language || session.language);
      const shouldReconnectDeepgram = nextLanguage !== session.language;
      session.language = nextLanguage;
      session.agentMode = sanitizeAgentMode(msg.agentMode || session.agentMode);
      session.customPrompt = sanitizeCustomPrompt(msg.customPrompt || session.customPrompt);
      if (shouldReconnectDeepgram) connectDeepgram();
      return;
    }

    if (msg.type === "audio_chunk" && typeof msg.audioBase64 === "string") {
      if (session.deepgramWs?.readyState === WebSocket.OPEN) {
        session.deepgramWs.send(Buffer.from(msg.audioBase64, "base64"));
      }
      return;
    }

    if (msg.type === "audio_finalize") {
      session.deepgramWs?.readyState === WebSocket.OPEN &&
        session.deepgramWs.send(JSON.stringify({ type: "Finalize" }));
      return;
    }

    if (msg.type === "barge_in") {
      resetCurrentGeneration("frontend_barge_in");
      return;
    }

    if (msg.type === "ping") {
      sendJson(clientWs, { type: "pong", ts: Date.now() });
      return;
    }

    sendJson(clientWs, { type: "protocol_warning", message: `Unknown message type: ${msg.type}` });
  });

  clientWs.on("close", cleanup);
  clientWs.on("error", cleanup);
});

httpServer.listen(PORT, () => {
  console.log(`Realtime voice server listening on :${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws`);
});
