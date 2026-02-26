import { NextResponse } from "next/server";
import {
  DEFAULT_VOICE_LANGUAGE,
  DEFAULT_VOICE_SETTINGS,
  VOICE_CONFIG,
} from "@/lib/voice/config";

export const runtime = "nodejs";

export async function GET() {
  const languages = Object.entries(VOICE_CONFIG).map(([code, entry]) => ({
    code,
    label: entry.label,
    voiceName: entry.name,
    sttLang: entry.stt_lang,
    voiceId: entry.voice_id,
  }));

  return NextResponse.json({
    languages,
    defaults: {
      language: DEFAULT_VOICE_LANGUAGE,
      audio: {
        inputEncoding: DEFAULT_VOICE_SETTINGS.deepgram.encoding,
        inputSampleRate: DEFAULT_VOICE_SETTINGS.deepgram.sampleRate,
        outputEncoding: DEFAULT_VOICE_SETTINGS.cartesia.encoding,
        outputSampleRate: DEFAULT_VOICE_SETTINGS.cartesia.sampleRate,
      },
    },
    limits: {
      maxAudioBytes: 3_000_000,
      maxConversationMessages: 6,
      requestTimeoutSeconds: 30,
    },
    endpoints: {
      respond: "/api/voice/respond",
    },
  });
}
