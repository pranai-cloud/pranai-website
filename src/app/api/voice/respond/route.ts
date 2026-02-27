import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import {
  DEFAULT_VOICE_LANGUAGE,
  DEFAULT_VOICE_SETTINGS,
  VOICE_CONFIG,
  VOICE_LANGUAGE_SUPPORT,
  type VoiceGender,
  type VoiceLanguageCode,
} from "@/lib/voice/config";

export const runtime = "nodejs";

const DEFAULT_SYSTEM_PROMPT =
  "You are the pran.ai Voice Assistant. Be warm, friendly, and professional in every reply. Keep responses concise and clear, usually 1-3 short sentences. If the user asks about pricing, integrations, security, or setup, you may use up to 4 short sentences for clarity. Never be rude, defensive, or robotic. Explain capabilities clearly without overpromising. Do not repeat generic openers like 'How can I help you today?' on every turn.";

const PRANAI_PRODUCT_CONTEXT_PROMPT = `
Brand pronunciation and identity:
- Brand name is written as "pran.ai".
- Never proactively explain how the brand is pronounced.
- Never correct the user's pronunciation or spelling unless the user explicitly asks for correction.
- If user says a variant (for example "PranAI", "pran.ai", or "Pranaya"), continue naturally without mentioning mismatch.

What pran.ai does:
- pran.ai helps businesses launch AI voice and chat agents for support, lead qualification, receptionist flows, and cart recovery.
- Typical value: faster response times, reduced repetitive workload, better conversion, multilingual coverage, and 24/7 availability.
- Deployment options include phone workflows and web/chat experiences.

Pricing model guidance:
- Explain that product pricing is based on active conversation usage (minutes/volume driven), not per-seat licensing.
- Clarify that demo cost values are package-estimated guidance, not raw provider pass-through billing.
- Do not invent exact plan names, prices, discounts, SLAs, feature lists, or contract terms unless explicitly provided.
- If exact pricing/features are not known, explicitly say that and offer a short next step to get a scoped quote.

Integration guidance:
- Explain integration is typically lightweight and phased.
- Mention common integration patterns: Salesforce, HubSpot, Zendesk, Freshworks, telephony systems, calendars, order systems, internal APIs, and webhooks.
- If asked "how to integrate", provide a simple path: discovery -> pilot -> connect data/FAQs -> connect systems -> go live -> monitor and iterate.

FAQ and trust guidance:
- Voice quality: natural, conversational, not robotic.
- Unknown answers: gracefully escalate with context handoff to humans.
- Data and security: emphasize enterprise-minded handling, encryption in transit/at rest, and controlled data usage.
- Language switching: support multilingual experiences and preserve context.

Response quality guardrails:
- Be practical and honest; avoid hype.
- If uncertain, say what is known and suggest next best step.
- Keep tone friendly and reassuring across all agent modes.
- Never correct, debate, or call out the user's pronunciation/spelling of the brand (for example "PranAI", "Pranaya", "pran.ai"), unless the user explicitly asks for correction.
- If user says a variant of the brand name, simply continue naturally without mentioning the mismatch.
`.trim();

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

type VoiceAgentMode =
  | "customer_support"
  | "lead_qualification"
  | "receptionist"
  | "cart_recovery";

const NOVA_2_LANGUAGE_CODES: VoiceLanguageCode[] = ["en", "hi"];
const DEEPGRAM_MODEL_NOVA_2 = "nova-2";
const DEEPGRAM_MODEL_NOVA_3 = "nova-3";
const VOICE_FAST_MAX_TOKENS = Number(process.env.VOICE_FAST_MAX_TOKENS ?? "90");
const VOICE_FAST_TEMPERATURE = Number(process.env.VOICE_FAST_TEMPERATURE ?? "0.4");
const VOICE_FAST_HISTORY_MESSAGES = Number(process.env.VOICE_FAST_HISTORY_MESSAGES ?? "4");
const PCM_BYTES_PER_SECOND = 16000 * 2;
const MIN_INPUT_AUDIO_SECONDS = Number(process.env.VOICE_MIN_INPUT_SECONDS ?? "0.45");

const AGENT_MODE_PROMPTS: Record<VoiceAgentMode, string> = {
  customer_support:
    "You are operating in Customer Support mode for pran.ai deployments. Prioritize fast issue resolution, intent triage, and clear next steps. Keep tone empathetic and reassuring. When relevant, explain how voice/chat automation reduces repetitive ticket load and improves response times.",
  lead_qualification:
    "You are operating in Lead Qualification mode for pran.ai. Qualify fit by use case, monthly conversation volume, required integrations, language needs, and rollout timeline. Keep tone consultative and friendly. Guide toward a practical pilot and next-step demo/discovery call.",
  receptionist:
    "You are operating in Receptionist mode for pran.ai-powered front desk flows. Greet warmly, capture essentials, route intelligently, and propose automation handoffs (booking, FAQ handling, lead capture) where useful.",
  cart_recovery:
    "You are operating in Cart Recovery mode for pran.ai commerce automation. Identify objections (price, shipping, trust, timing), respond with concise reassurance, and nudge toward completion without being pushy. Keep tone helpful and positive. Reference how personalized voice/chat follow-ups can lift conversion.",
};

interface CostBreakdown {
  sttUsd: number;
  llmUsd: number;
  ttsUsd: number;
  totalUsd: number;
  inputAudioSeconds: number;
  outputAudioSeconds: number;
  promptTokens: number | null;
  completionTokens: number | null;
}

interface VoiceRespondRequestBody {
  language?: string;
  audioBase64?: string;
  audioDataUrl?: string;
  conversation?: ConversationMessage[];
  agentMode?: string;
  customPrompt?: string;
}

function stripUnwantedPronunciationCorrections(text: string): string {
  let out = text;
  out = out.replace(/\(I assume you meant [^)]+\)/gi, "");
  out = out.replace(/I assume you meant [^.,!?]+[.,!?]?/gi, "");
  out = out.replace(/(?:you|u)\s+mean(?:t)?\s+pran(?:\.|\s*)?ai[.?!]?/gi, "");
  out = out.replace(/(?:it'?s|its)\s+pronounced\s+[^.?!]+[.?!]?/gi, "");
  return out.trim();
}

function enforceHindiFeminineFirstPerson(text: string, language: VoiceLanguageCode): string {
  if (language !== "hi") return text;
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

function sanitizeLanguage(input?: string): VoiceLanguageCode {
  if (!input) return DEFAULT_VOICE_LANGUAGE;
  return input in VOICE_CONFIG
    ? (input as VoiceLanguageCode)
    : DEFAULT_VOICE_LANGUAGE;
}

function parseAudioBase64(body: VoiceRespondRequestBody): string | null {
  if (body.audioBase64?.trim()) return body.audioBase64.trim();
  if (!body.audioDataUrl?.trim()) return null;

  const match = body.audioDataUrl.match(/^data:.*;base64,(.+)$/);
  return match?.[1] ?? null;
}

function redactPII(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\+?\d[\d\s\-()]{8,}\d/g, "[redacted-phone]");
}

function sanitizeAgentMode(input?: string): VoiceAgentMode {
  if (!input) return "customer_support";
  return input in AGENT_MODE_PROMPTS
    ? (input as VoiceAgentMode)
    : "customer_support";
}

function sanitizeCustomPrompt(input?: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, 600);
}

async function readErrorBody(res: Response): Promise<string> {
  try {
    const text = await res.text();
    return text.slice(0, 600);
  } catch {
    return "Unable to read provider error body.";
  }
}

function isCartesiaLanguageSupportError(details: string): boolean {
  const normalized = details.toLowerCase();
  return (
    normalized.includes("model does not support language") ||
    (normalized.includes("invalid model id") && normalized.includes("language"))
  );
}

async function transcribeWithDeepgram(
  audioBuffer: Buffer,
  languageCode: VoiceLanguageCode,
  sttLanguage: string,
  deepgramApiKey: string,
): Promise<{ transcript: string; confidence: number | null }> {
  const model = NOVA_2_LANGUAGE_CODES.includes(languageCode)
    ? DEEPGRAM_MODEL_NOVA_2
    : DEEPGRAM_MODEL_NOVA_3;
  const query = new URLSearchParams({
    model,
    language: sttLanguage,
    encoding: DEFAULT_VOICE_SETTINGS.deepgram.encoding,
    sample_rate: String(DEFAULT_VOICE_SETTINGS.deepgram.sampleRate),
    punctuate: String(DEFAULT_VOICE_SETTINGS.deepgram.punctuate),
    smart_format: String(DEFAULT_VOICE_SETTINGS.deepgram.smartFormat),
  });

  const res = await fetch(`https://api.deepgram.com/v1/listen?${query.toString()}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${deepgramApiKey}`,
      "Content-Type": "application/octet-stream",
    },
    body: new Uint8Array(audioBuffer),
  });

  if (!res.ok) {
    const details = await readErrorBody(res);
    throw new Error(`Deepgram STT failed (${res.status}): ${details}`);
  }

  const payload = await res.json();
  const alt = payload?.results?.channels?.[0]?.alternatives?.[0];
  const transcript = (alt?.transcript ?? "").trim();
  const confidence = typeof alt?.confidence === "number" ? alt.confidence : null;

  if (!transcript) {
    throw new Error("NO_SPEECH_DETECTED");
  }

  return { transcript, confidence };
}

async function generateWithGroq(
  transcript: string,
  languageLabel: string,
  voiceName: string,
  voiceGender: VoiceGender,
  conversation: ConversationMessage[],
  agentMode: VoiceAgentMode,
  customPrompt: string | null,
  groqApiKey: string,
): Promise<{
  responseText: string;
  promptTokens: number | null;
  completionTokens: number | null;
}> {
  const groq = new Groq({ apiKey: groqApiKey });
  const history = conversation
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-Math.max(0, VOICE_FAST_HISTORY_MESSAGES));

  const completion = await groq.chat.completions.create({
    model: DEFAULT_VOICE_SETTINGS.groq.model,
    max_tokens: Number.isFinite(VOICE_FAST_MAX_TOKENS) && VOICE_FAST_MAX_TOKENS > 0
      ? VOICE_FAST_MAX_TOKENS
      : DEFAULT_VOICE_SETTINGS.groq.maxTokens,
    temperature: Number.isFinite(VOICE_FAST_TEMPERATURE)
      ? VOICE_FAST_TEMPERATURE
      : DEFAULT_VOICE_SETTINGS.groq.temperature,
    messages: [
      {
        role: "system",
        content: process.env.VOICE_AGENT_SYSTEM_PROMPT ?? DEFAULT_SYSTEM_PROMPT,
      },
      {
        role: "system",
        content: PRANAI_PRODUCT_CONTEXT_PROMPT,
      },
      {
        role: "system",
        content: AGENT_MODE_PROMPTS[agentMode],
      },
      ...(customPrompt
        ? [
            {
              role: "system" as const,
              content: `Additional business context from user (append-only): ${customPrompt}`,
            },
          ]
        : []),
      {
        role: "system",
        content:
          `Selected response language is ${languageLabel}. Reply in that language. Keep voice-friendly brevity (usually 1-3 short sentences, up to 4 for pricing/integrations/FAQ clarity).`,
      },
      {
        role: "system",
        content:
          `Voice persona name: ${voiceName}. Voice gender presentation: ${voiceGender}. ` +
          "In gendered languages, ALWAYS use first-person grammar that matches this gender and never switch gendered forms. " +
          "Hindi examples: feminine -> 'मैं समझती हूँ', 'मैं गई थी', 'मैं कर सकती हूँ'; masculine -> 'मैं समझता हूँ', 'मैं गया था', 'मैं कर सकता हूँ'. " +
          "If language is Hindi/Hinglish and voice is feminine, NEVER use masculine first-person forms.",
      },
      ...history,
      { role: "user", content: transcript },
    ],
  });

  const responseText = completion.choices?.[0]?.message?.content?.trim();
  if (!responseText) {
    throw new Error("Groq returned an empty completion.");
  }

  return {
    responseText,
    promptTokens:
      typeof completion.usage?.prompt_tokens === "number"
        ? completion.usage.prompt_tokens
        : null,
    completionTokens:
      typeof completion.usage?.completion_tokens === "number"
        ? completion.usage.completion_tokens
        : null,
  };
}

async function synthesizeWithCartesia(
  responseText: string,
  languageCode: VoiceLanguageCode,
  voiceId: string,
  cartesiaApiKey: string,
): Promise<Buffer> {
  const res = await fetch("https://api.cartesia.ai/tts/bytes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cartesiaApiKey}`,
      "Content-Type": "application/json",
      "Cartesia-Version":
        process.env.CARTESIA_API_VERSION ?? DEFAULT_VOICE_SETTINGS.cartesia.apiVersion,
    },
    body: JSON.stringify({
      model_id: process.env.CARTESIA_TTS_MODEL_ID ?? DEFAULT_VOICE_SETTINGS.cartesia.modelId,
      transcript: responseText,
      language: languageCode,
      voice: {
        mode: "id",
        id: voiceId,
      },
      output_format: {
        container: "wav",
        encoding: DEFAULT_VOICE_SETTINGS.cartesia.encoding,
        sample_rate: DEFAULT_VOICE_SETTINGS.cartesia.sampleRate,
      },
    }),
  });

  if (!res.ok) {
    const details = await readErrorBody(res);
    if (isCartesiaLanguageSupportError(details)) {
      throw new Error(`CARTESIA_LANGUAGE_UNSUPPORTED::${details}`);
    }
    throw new Error(`Cartesia TTS failed (${res.status}): ${details}`);
  }

  const audio = Buffer.from(await res.arrayBuffer());
  if (!audio.length) {
    throw new Error("Cartesia returned empty audio.");
  }
  return audio;
}

function roundUsd(value: number): number {
  return Number(value.toFixed(6));
}

function estimateTurnCostUsd(args: {
  inputAudioBytes: number;
  outputAudioBytes: number;
  promptTokens: number | null;
  completionTokens: number | null;
}): CostBreakdown {
  // These are illustrative defaults so the UI can show affordability.
  // Override with exact negotiated/provider rates via environment variables.
  // VOICE_COST_ESTIMATE_MULTIPLIER lets product pricing differ from raw provider cost.
  const sttPerMinute = Number(process.env.VOICE_COST_STT_PER_MIN_USD ?? "0.0043");
  const llmPromptPer1k = Number(process.env.VOICE_COST_LLM_PROMPT_PER_1K_USD ?? "0.0006");
  const llmCompletionPer1k = Number(
    process.env.VOICE_COST_LLM_COMPLETION_PER_1K_USD ?? "0.0012",
  );
  const ttsPerSecond = Number(process.env.VOICE_COST_TTS_PER_SEC_USD ?? "0.0002");
  const estimateMultiplierRaw = Number(process.env.VOICE_COST_ESTIMATE_MULTIPLIER ?? "0.75");
  const estimateMultiplier = Number.isFinite(estimateMultiplierRaw) && estimateMultiplierRaw > 0
    ? estimateMultiplierRaw
    : 0.75;

  // 16kHz, mono, 16-bit PCM => 32000 bytes/sec
  const inputAudioSeconds = args.inputAudioBytes / PCM_BYTES_PER_SECOND;
  const outputAudioSeconds = args.outputAudioBytes / PCM_BYTES_PER_SECOND;

  const sttUsd = (inputAudioSeconds / 60) * sttPerMinute;
  const llmUsd =
    ((args.promptTokens ?? 0) / 1000) * llmPromptPer1k +
    ((args.completionTokens ?? 0) / 1000) * llmCompletionPer1k;
  const ttsUsd = outputAudioSeconds * ttsPerSecond;
  const adjustedSttUsd = sttUsd * estimateMultiplier;
  const adjustedLlmUsd = llmUsd * estimateMultiplier;
  const adjustedTtsUsd = ttsUsd * estimateMultiplier;
  const totalUsd = adjustedSttUsd + adjustedLlmUsd + adjustedTtsUsd;

  return {
    sttUsd: roundUsd(adjustedSttUsd),
    llmUsd: roundUsd(adjustedLlmUsd),
    ttsUsd: roundUsd(adjustedTtsUsd),
    totalUsd: roundUsd(totalUsd),
    inputAudioSeconds: Number(inputAudioSeconds.toFixed(2)),
    outputAudioSeconds: Number(outputAudioSeconds.toFixed(2)),
    promptTokens: args.promptTokens,
    completionTokens: args.completionTokens,
  };
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();

  try {
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;
    const cartesiaApiKey = process.env.CARTESIA_API_KEY;

    if (!deepgramApiKey || !groqApiKey || !cartesiaApiKey) {
      return NextResponse.json(
        { error: "Missing DEEPGRAM_API_KEY, GROQ_API_KEY, or CARTESIA_API_KEY." },
        { status: 500 },
      );
    }

    const body = (await req.json()) as VoiceRespondRequestBody;
    const language = sanitizeLanguage(body.language);
    const agentMode = sanitizeAgentMode(body.agentMode);
    const customPrompt = sanitizeCustomPrompt(body.customPrompt);
    const languageSupport = VOICE_LANGUAGE_SUPPORT[language];
    const voiceEntry = VOICE_CONFIG[language];
    const audioBase64 = parseAudioBase64(body);

    if (!languageSupport?.tts) {
      return NextResponse.json(
        {
          error:
            `Live voice output is not yet available for ${voiceEntry.label} in this demo. ` +
            "Please try English or Hindi for now.",
          code: "TTS_LANGUAGE_UNSUPPORTED",
        },
        { status: 422 },
      );
    }

    if (!audioBase64) {
      return NextResponse.json(
        { error: "Missing audio payload. Provide audioBase64 or audioDataUrl." },
        { status: 400 },
      );
    }

    const audioBuffer = Buffer.from(audioBase64, "base64");
    if (!audioBuffer.length) {
      return NextResponse.json({ error: "Audio payload is empty." }, { status: 400 });
    }
    const inputAudioSeconds = audioBuffer.length / PCM_BYTES_PER_SECOND;
    if (inputAudioSeconds < MIN_INPUT_AUDIO_SECONDS) {
      return NextResponse.json(
        {
          error:
            "We couldn't hear enough speech. Please speak for at least a second and try again.",
          code: "AUDIO_TOO_SHORT",
        },
        { status: 422 },
      );
    }

    let transcript: string;
    let confidence: number | null;
    try {
      const transcription = await transcribeWithDeepgram(
        audioBuffer,
        language,
        voiceEntry.stt_lang,
        deepgramApiKey,
      );
      transcript = transcription.transcript;
      confidence = transcription.confidence;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("NO_SPEECH_DETECTED")) {
        return NextResponse.json(
          {
            error:
              "I couldn't understand that clearly. Try again in a quieter place and speak a little closer to your mic.",
            code: "NO_SPEECH_DETECTED",
          },
          { status: 422 },
        );
      }
      throw error;
    }

    const lowConfidenceThreshold = Number(process.env.STT_LOW_CONFIDENCE_THRESHOLD ?? "0.5");
    const shouldAskRepeat = confidence !== null && confidence < lowConfidenceThreshold;

    let assistantText = `I'm sorry, I didn't catch that clearly. Could you repeat your question in ${voiceEntry.label}?`;
    let promptTokens: number | null = null;
    let completionTokens: number | null = null;

    if (!shouldAskRepeat) {
      const llmResponse = await generateWithGroq(
        transcript,
        voiceEntry.label,
        voiceEntry.name,
        voiceEntry.gender,
        body.conversation ?? [],
        agentMode,
        customPrompt,
        groqApiKey,
      );
      assistantText = stripUnwantedPronunciationCorrections(llmResponse.responseText);
      assistantText = enforceHindiFeminineFirstPerson(assistantText, language);
      promptTokens = llmResponse.promptTokens;
      completionTokens = llmResponse.completionTokens;
    }

    let ttsAudio: Buffer;
    try {
      ttsAudio = await synthesizeWithCartesia(
        assistantText,
        language,
        voiceEntry.voice_id,
        cartesiaApiKey,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("CARTESIA_LANGUAGE_UNSUPPORTED::")) {
        return NextResponse.json(
          {
            error:
              `Live voice output is not yet available for ${voiceEntry.label} in this demo. ` +
              "Please try English or Hindi for now.",
            code: "TTS_LANGUAGE_UNSUPPORTED",
          },
          { status: 422 },
        );
      }
      throw error;
    }
    const estimatedCost = estimateTurnCostUsd({
      inputAudioBytes: audioBuffer.length,
      outputAudioBytes: ttsAudio.length,
      promptTokens,
      completionTokens,
    });

    const elapsedMs = Date.now() - startedAt;
    console.info("[voice.respond] success", {
      language,
      confidence,
      elapsedMs,
      transcript: redactPII(transcript).slice(0, 140),
      responsePreview: redactPII(assistantText).slice(0, 140),
    });

    return NextResponse.json({
      language,
      voiceId: voiceEntry.voice_id,
      transcript,
      confidence,
      assistantText,
      audioBase64: ttsAudio.toString("base64"),
      audioMimeType: "audio/wav",
      estimatedCost,
      timing: { totalMs: elapsedMs },
    });
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    console.error("[voice.respond] failed", {
      elapsedMs,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: "Voice response pipeline failed.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
