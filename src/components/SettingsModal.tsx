import React, { useState, useEffect } from 'react';
import { X, Settings, Volume2, Key, Sliders, Play, Check } from 'lucide-react';
import { type SpeechSettings, getAvailableVoices, speakText } from '../utils/speechService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SpeechSettings;
  onSaveSettings: (settings: SpeechSettings) => void;
  confidenceThreshold: number;
  setConfidenceThreshold: (val: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  confidenceThreshold,
  setConfidenceThreshold,
}) => {
  const [localSettings, setLocalSettings] = useState<SpeechSettings>(settings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    getAvailableVoices().then(setVoices);
  }, []);

  if (!isOpen) return null;

  const handleTestSpeech = async () => {
    setIsTestingVoice(true);
    const testPhrase =
      localSettings.language === 'kz'
        ? 'Сәлем! Мен BulNe көру жүйесімін. Сіздің камераңыздағы заттарды тани аламын.'
        : localSettings.language === 'ru'
        ? 'Привет! Я система BulNe. Я могу определять предметы в объективе вашей камеры.'
        : 'Hello! I am BulNe vision assistant. I can identify and speak whatever your camera sees.';

    await speakText(testPhrase, localSettings, { force: true });
    setIsTestingVoice(false);
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-700/60 text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Баптаулар / Настройки</h3>
              <p className="text-xs text-slate-400">Дауыс, жылдамдық және ИИ дәлдігі</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="py-5 space-y-6">
          {/* Speech Speed / Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Сөйлеу жылдамдығы / Скорость речи</span>
              </span>
              <span className="font-mono text-cyan-400">{localSettings.rate}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.1"
              value={localSettings.rate}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, rate: parseFloat(e.target.value) })
              }
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Browser Voice Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Браузер дауысы / Системный голос</span>
            </label>
            <select
              value={localSettings.voiceURI || ''}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, voiceURI: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="">Автоматты (Жүйелік ең жақсы дауыс)</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Detection Confidence Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <span>Сезімталдық дәлдігі / Порог точности (AI)</span>
              <span className="font-mono text-amber-400">
                {Math.round(confidenceThreshold * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.35"
              max="0.85"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* ElevenLabs Studio TTS Toggle */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  ElevenLabs Studio Voice (AI Дауыс)
                </span>
              </div>
              <input
                type="checkbox"
                checked={localSettings.useElevenLabs}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, useElevenLabs: e.target.checked })
                }
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>

            {localSettings.useElevenLabs && (
              <div className="space-y-2 pt-2 text-xs">
                <input
                  type="password"
                  placeholder="ElevenLabs API кілті (sk_...)"
                  value={localSettings.elevenLabsApiKey || ''}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, elevenLabsApiKey: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  ElevenLabs Multilingual v2 моделі қазақ және орыс тілдерін студиялық табиғи үнмен сөйлейді.
                </p>
              </div>
            )}
          </div>

          {/* Test Voice Button */}
          <button
            onClick={handleTestSpeech}
            disabled={isTestingVoice}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold transition cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isTestingVoice ? 'animate-spin' : ''}`} />
            <span>Дауысты тексеру / Тест звучания</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Болдырмау / Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Сақтау / Сохранить</span>
          </button>
        </div>
      </div>
    </div>
  );
};
