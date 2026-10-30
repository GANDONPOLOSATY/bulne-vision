// Speech Synthesis Service (Web Speech API + ElevenLabs Multilingual)

export type SupportedLanguage = 'kz' | 'ru' | 'en';

export interface SpeechSettings {
  language: SupportedLanguage;
  rate: number; // 0.7 to 1.3
  pitch: number; // 0.8 to 1.2
  volume: number; // 0 to 1
  voiceURI?: string;
  useElevenLabs: boolean;
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string; // default e.g. "21m00Tcm4TlvDq8ikWAM" (Rachel) or "pNInz6obpgDQGcFmaJgB" (Adam)
}

let lastSpokenText = '';
let lastSpokenTime = 0;
let currentAudio: HTMLAudioElement | null = null;

export const DEFAULT_SPEECH_SETTINGS: SpeechSettings = {
  language: 'kz',
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  useElevenLabs: false,
  elevenLabsApiKey: '',
  elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM',
};

// Get available Web Speech voices
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };

    // Timeout fallback
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 500);
  });
}

// Find optimal voice for selected language
export function findBestVoice(voices: SpeechSynthesisVoice[], lang: SupportedLanguage): SpeechSynthesisVoice | undefined {
  if (lang === 'kz') {
    // Try Kazakh first
    const kzVoice = voices.find(v => v.lang.startsWith('kk') || v.lang.includes('KZ') || v.name.toLowerCase().includes('kazakh'));
    if (kzVoice) return kzVoice;
    // Fallback to Russian voice which pronounces Cyrillic Kazakh phonetics well
    const ruVoice = voices.find(v => v.lang.startsWith('ru') || v.name.toLowerCase().includes('russian'));
    if (ruVoice) return ruVoice;
  } else if (lang === 'ru') {
    const ruVoice = voices.find(v => v.lang.startsWith('ru') || v.lang.includes('RU') || v.name.toLowerCase().includes('russian'));
    if (ruVoice) return ruVoice;
  } else if (lang === 'en') {
    const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (enVoice) return enVoice;
  }
  return voices[0];
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

// Speak text using ElevenLabs API
async function speakWithElevenLabs(text: string, apiKey: string, voiceId: string): Promise<boolean> {
  try {
    stopSpeaking();
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
  options?: { force?: boolean; debounceMs?: number }
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

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = settings.rate;
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
