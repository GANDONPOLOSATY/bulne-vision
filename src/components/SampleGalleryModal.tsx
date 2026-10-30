import React from 'react';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages';
import type { SampleImage } from '../data/sampleImages';
import type { SupportedLanguage } from '../utils/speechService';

interface SampleGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleImage) => void;
  language: SupportedLanguage;
}

export const SampleGalleryModal: React.FC<SampleGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-700/60 text-cyan-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {language === 'kz' ? 'Үлгі заттар галереясы' : 'Галерея примеров объектов'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'kz'
                  ? 'Камерасыз жылдам сынап көру үшін кез келген суретті таңдаңыз'
                  : 'Выберите объект для быстрой проверки распознавания без веб-камеры'}
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

        {/* Grid of sample cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 overflow-y-auto">
          {SAMPLE_IMAGES.map((sample) => {
            const label =
              language === 'kz'
                ? sample.nameKz
                : language === 'ru'
                ? sample.nameRu
                : sample.nameEn;

            return (
              <button
                key={sample.id}
                onClick={() => {
                  onSelectSample(sample);
                  onClose();
                }}
                className="group relative flex flex-col rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500/80 transition-all text-left cursor-pointer p-3 hover:shadow-lg hover:shadow-cyan-950/40"
              >
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800/80 mb-3 flex items-center justify-center">
                  <img
                    src={sample.src}
                    alt={label}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-700 text-[10px] text-cyan-300 font-mono">
                    {sample.expectedClass}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white group-hover:text-cyan-400 transition">
                    {label}
                  </span>
                  <Sparkles className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            {language === 'kz' ? 'Жабу' : 'Закрыть'}
          </button>
        </div>
      </div>
    </div>
  );
};
