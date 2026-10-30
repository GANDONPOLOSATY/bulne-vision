import React from 'react';
import { X, Volume2, Trash2, History, Clock } from 'lucide-react';
import type { DetectionResult } from '../utils/detectorService';
import type { SupportedLanguage } from '../utils/speechService';

export interface HistoryItem {
  id: string;
  timestamp: string;
  detection: DetectionResult;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onPlaySpeech: (item: HistoryItem) => void;
  language: SupportedLanguage;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onPlaySpeech,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md h-full bg-slate-950 border-l border-slate-800 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-700/60 text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {language === 'kz' ? 'Сканерлеу тарихы' : 'История сканирования'}
              </h2>
              <p className="text-xs text-slate-400">
                {history.length}{' '}
                {language === 'kz' ? 'нысан анықталды' : 'объектов обнаружено'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 text-sm">
              <History className="w-10 h-10 stroke-1 mb-2 opacity-50" />
              <p>
                {language === 'kz'
                  ? 'Әзірге ешбір зат сканерленбеді.'
                  : 'Пока ничего не было отсканировано.'}
              </p>
            </div>
          ) : (
            history.map((item) => {
              const { knowledge, score } = item.detection;
              const name =
                language === 'kz'
                  ? knowledge.kz
                  : language === 'ru'
                  ? knowledge.ru
                  : knowledge.en;

              const phrase =
                language === 'kz'
                  ? knowledge.spokenKz
                  : language === 'ru'
                  ? knowledge.spokenRu
                  : knowledge.spokenEn;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex items-start justify-between gap-3 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-medium">
                        {Math.round(score * 100)}%
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                      {name}
                    </h4>

                    <p className="text-xs text-slate-400 italic mt-0.5">«{phrase}»</p>
                  </div>

                  <button
                    onClick={() => onPlaySpeech(item)}
                    className="p-2.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 text-cyan-400 transition cursor-pointer"
                    title="Дауыстап айту / Озвучить"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={onClearHistory}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-800/60 text-red-300 text-xs font-semibold transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{language === 'kz' ? 'Тарихты тазалау' : 'Очистить историю'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
