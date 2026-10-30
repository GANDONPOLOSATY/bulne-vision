export type SupportedLanguage = 'kz' | 'ru' | 'en';

export interface SpeechSettings {
  language: SupportedLanguage;
  rate: number;
  pitch: number;
  volume: number;
  useElevenLabs: boolean;
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string;
  voiceURI?: string;
}

export const DEFAULT_SPEECH_SETTINGS: SpeechSettings = {
  language: 'kz',
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  useElevenLabs: true, // Default to true using user's ElevenLabs account for ultra-realistic speech
  elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel / Multilingual
};

let currentAudio: HTMLAudioElement | null = null;
let lastSpokenText = '';
let lastSpokenTime = 0;

// Best voice heuristic for Kazakh and Russian in Web Speech API
function findBestVoice(voices: SpeechSynthesisVoice[], lang: SupportedLanguage): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  if (lang === 'kz') {
    // Look for kk-KZ or kk voice
    const kz = voices.find(v => v.lang.startsWith('kk') || v.lang.includes('KZ'));
    if (kz) return kz;
    // Kazakh can fallback to Russian phonetics gracefully if no Kazakh TTS engine is installed on device
    const ru = voices.find(v => v.lang.startsWith('ru'));
    if (ru) return ru;
  } else if (lang === 'ru') {
    const ru = voices.find(v => v.lang.startsWith('ru') || v.lang.includes('RU'));
    if (ru) return ru;
  }

  // Fallback to English or default
  return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

// Speak text using ElevenLabs API
async function speakWithElevenLabs(text: string, apiKey: string, voiceId: string): Promise<boolean> {
  try {
    stopSpeaking();

  // Mobile audio safety
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      console.warn('ElevenLabs API returned error:', response.status);
      return false;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    currentAudio = new Audio(url);
    await currentAudio.play();
    return true;
  } catch (err) {
    console.error('ElevenLabs playback failed, falling back to Web Speech:', err);
    return false;
  }
}

export async function speakText(
  text: string,
  settings: SpeechSettings,
  options?: { force?: boolean; debounceMs?: number; rate?: number }
) {
  if (!text || text.trim() === '') return;

  const now = Date.now();
  const debounce = options?.debounceMs ?? 6000;

  // Prevent speech spam for the exact same item within debounce period
  if (!options?.force && text === lastSpokenText && now - lastSpokenTime < debounce) {
    return;
  }

  lastSpokenText = text;
  lastSpokenTime = now;

  // Try ElevenLabs if configured
  if (settings.useElevenLabs && settings.elevenLabsApiKey) {
    const success = await speakWithElevenLabs(text, settings.elevenLabsApiKey, settings.elevenLabsVoiceId || '21m00Tcm4TlvDq8ikWAM');
    if (success) return;
  }

  // Native Web Speech API
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Web Speech API is not supported in this browser.');
    return;
  }

  stopSpeaking();

  // Mobile audio safety
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options?.rate ?? settings.rate;
  utterance.pitch = settings.pitch;
  utterance.volume = settings.volume;

  const voices = window.speechSynthesis.getVoices();
  if (settings.voiceURI) {
    const selected = voices.find(v => v.voiceURI === settings.voiceURI);
    if (selected) utterance.voice = selected;
  } else {
    const best = findBestVoice(voices, settings.language);
    if (best) utterance.voice = best;
  }

  if (settings.language === 'kz') {
    utterance.lang = 'kk-KZ';
  } else if (settings.language === 'ru') {
    utterance.lang = 'ru-RU';
  } else {
    utterance.lang = 'en-US';
  }

  window.speechSynthesis.speak(utterance);
}
