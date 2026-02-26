export type VoiceLanguageCode = "en" | "hi" | "te" | "kn" | "mr" | "bn";

export interface VoiceConfigEntry {
  voice_id: string;
  name: string;
  lang: VoiceLanguageCode;
  stt_lang: string;
  label: string;
}

export const VOICE_CONFIG: Record<VoiceLanguageCode, VoiceConfigEntry> = {
  en: {
    voice_id: "e8e5fffb-252c-436d-b842-8879b84445b6",
    name: "Cathy",
    lang: "en",
    stt_lang: "en",
    label: "English",
  },
  hi: {
    voice_id: "28ca2041-5dda-42df-8123-f58ea9c3da00",
    name: "Palak",
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
    voice_id: "5c32dce6-936a-4892-b131-bafe474afe5f",
    name: "Anika",
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
    modelId: "sonic-multilingual",
    sampleRate: 16000,
    encoding: "pcm_s16le",
    apiVersion: "2025-04-16",
  },
} as const;
