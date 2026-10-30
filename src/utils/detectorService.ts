import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { lookupItem, type ItemKnowledge } from '../data/translations';

export interface DetectionResult {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
  knowledge: ItemKnowledge;
}

let model: cocoSsd.ObjectDetection | null = null;
let isModelLoading = false;

export async function loadVisionModel(
  onProgress?: (status: string) => void
): Promise<cocoSsd.ObjectDetection> {
  if (model) return model;
  if (isModelLoading) {
    while (isModelLoading) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (model) return model;
  }

  isModelLoading = true;
  try {
    onProgress?.('Тензорлық ядро дайындалуда... / Инициализация движка...');
    await tf.ready();

    // Prefer WebGL backend for high-speed hardware acceleration
    try {
      await tf.setBackend('webgl');
    } catch {
      await tf.setBackend('cpu');
    }

    onProgress?.('Нейрожүйе моделі жүктелуде... / Загрузка нейросети COCO-SSD...');
    model = await cocoSsd.load({
      base: 'lite_mobilenet_v2' // Fast, lightweight, smooth mobile performance
    });

    onProgress?.('Дайын! / Готово!');
    return model;
  } finally {
    isModelLoading = false;
  }
}

export async function detectObjects(
  imageElement: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  minConfidence = 0.5
): Promise<DetectionResult[]> {
  if (!model) {
    await loadVisionModel();
  }
  if (!model) return [];

  try {
    const predictions = await model.detect(imageElement, 5, minConfidence);
    return predictions.map(pred => ({
      bbox: pred.bbox,
      class: pred.class,
      score: pred.score,
      knowledge: lookupItem(pred.class)
    }));
  } catch (err) {
    console.error('Detection error:', err);
    return [];
  }
}

// Draw futuristic cyber-tactile HUD bounding boxes on canvas
export function drawHUDOverlay(
  canvas: HTMLCanvasElement,
  detections: DetectionResult[],
  activeLang: 'kz' | 'ru' | 'en',
  options?: { showLabels?: boolean; selectedDetection?: DetectionResult | null }
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const showLabels = options?.showLabels ?? true;
  const selected = options?.selectedDetection;

  detections.forEach((det, index) => {
    const [x, y, width, height] = det.bbox;
    const scorePct = Math.round(det.score * 100);

    // Primary is either the explicitly selected detection or the first (highest confidence)
    const isPrimary = selected
      ? det.class === selected.class &&
        Math.abs(det.bbox[0] - selected.bbox[0]) < 10 &&
        Math.abs(det.bbox[1] - selected.bbox[1]) < 10
      : index === 0;
    const strokeColor = isPrimary ? '#00e5ff' : '#38bdf8';
    const glowColor = isPrimary ? 'rgba(0, 229, 255, 0.5)' : 'rgba(56, 189, 248, 0.3)';

    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 12;

    // Corner brackets length
    const cornerLength = Math.min(24, Math.min(width, height) / 3);
    const cornerRadius = 6;

    ctx.lineWidth = isPrimary ? 3 : 2;
    ctx.strokeStyle = strokeColor;

    // Draw tech brackets around corners
    // Top-left
    ctx.beginPath();
    ctx.moveTo(x, y + cornerLength);
    ctx.lineTo(x, y + cornerRadius);
    ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
    ctx.lineTo(x + cornerLength, y);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(x + width - cornerLength, y);
    ctx.lineTo(x + width - cornerRadius, y);
    ctx.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
    ctx.lineTo(x + width, y + cornerLength);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(x + width, y + height - cornerLength);
    ctx.lineTo(x + width, y + height - cornerRadius);
    ctx.arcTo(x + width, y + height, x + width - cornerRadius, y + height, cornerRadius);
    ctx.lineTo(x + width - cornerLength, y + height);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(x + cornerLength, y + height);
    ctx.lineTo(x + cornerRadius, y + height);
    ctx.arcTo(x, y + height, x, y + height - cornerRadius, cornerRadius);
    ctx.lineTo(x, y + height - cornerLength);
    ctx.stroke();

    // Subtle faint bounding box line
    ctx.strokeStyle = isPrimary ? 'rgba(0, 229, 255, 0.2)' : 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // Draw central target crosshair if primary
    if (isPrimary && width > 40 && height > 40) {
      const cx = x + width / 2;
      const cy = y + height / 2;
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy);
      ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx, cy + 8);
      ctx.stroke();
    }

    // Floating Label
    if (showLabels) {
      const labelText =
        activeLang === 'kz'
          ? det.knowledge.kz
          : activeLang === 'ru'
          ? det.knowledge.ru
          : det.knowledge.en;

      ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const textMetrics = ctx.measureText(`${labelText}  ${scorePct}%`);
      const paddingX = 8;
      const paddingY = 4;
      const labelW = textMetrics.width + paddingX * 2;
      const labelH = 22;
      const labelX = x;
      const labelY = Math.max(0, y - labelH - 4);

      // Dark background pill
      ctx.fillStyle = isPrimary ? 'rgba(7, 10, 18, 0.92)' : 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(labelX, labelY, labelW, labelH, 6);
      ctx.fill();

      // Border outline
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Text label
      ctx.fillStyle = isPrimary ? '#00e5ff' : '#ffffff';
      ctx.fillText(labelText, labelX + paddingX, labelY + 15);

      // Confidence badge
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`${scorePct}%`, labelX + labelW - paddingX - ctx.measureText(`${scorePct}%`).width, labelY + 15);
    }

    ctx.restore();
  });
}
