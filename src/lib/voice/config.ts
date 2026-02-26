export type VoiceLanguageCode = "en" | "hi" | "te" | "kn" | "mr" | "bn";

export interface VoiceConfigEntry {
  voice_id: string;
  name: string;
  lang: VoiceLanguageCode;
  stt_lang: string;
  label: string;
}

export interface VoiceLanguageSupport {
  stt: boolean;
  tts: boolean;
}

export const VOICE_CONFIG: Record<VoiceLanguageCode, VoiceConfigEntry> = {
  en: {
    voice_id: "e07c00bc-4134-4eae-9ea4-1a55fb45746b",
    name: "Brooke",
    lang: "en",
    stt_lang: "en",
    label: "English",
  },
  hi: {
    voice_id: "faf0731e-dfb9-4cfc-8119-259a79b27e12",
    name: "Riya",
    lang: "hi",
    stt_lang: "hi",
    label: "Hindi",
  },
  te: {
    voice_id: "07bc462a-c644-49f1-baf7-82d5599131be",
    name: "Sindhu",
    lang: "te",
    stt_lang: "te",
    label: "Telugu",
  },
  kn: {
    voice_id: "7c6219d2-e8d2-462c-89d8-7ecba7c75d65",
    name: "Divya",
    lang: "kn",
    stt_lang: "kn",
    label: "Kannada",
  },
  mr: {
    voice_id: "f227bc18-3704-47fe-b759-8c78a450fdfa",
    name: "Suresh",
    lang: "mr",
    stt_lang: "mr",
    label: "Marathi",
  },
  bn: {
    voice_id: "2ba861ea-7cdc-43d1-8608-4045b5a41de5",
    name: "Rubel",
    lang: "bn",
    stt_lang: "bn",
    label: "Bengali",
  },
};

export const VOICE_LANGUAGE_SUPPORT: Record<VoiceLanguageCode, VoiceLanguageSupport> = {
  en: { stt: true, tts: true },
  hi: { stt: true, tts: true },
  te: { stt: true, tts: true },
  kn: { stt: true, tts: true },
  mr: { stt: true, tts: true },
  bn: { stt: true, tts: true },
};

export const DEFAULT_VOICE_LANGUAGE: VoiceLanguageCode = "en";

export const DEFAULT_VOICE_SETTINGS = {
  deepgram: {
    model: "nova-2",
    encoding: "linear16",
    sampleRate: 16000,
    punctuate: true,
    smartFormat: true,
  },
  groq: {
    model: "llama-3.3-70b-versatile",
    maxTokens: 150,
    temperature: 0.7,
  },
  cartesia: {
    modelId: "sonic-3",
    sampleRate: 16000,
    encoding: "pcm_s16le",
    apiVersion: "2025-04-16",
  },
} as const;
