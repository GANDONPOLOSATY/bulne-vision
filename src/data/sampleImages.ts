// Sample images generated via SVG data URLs for instant testing without a physical webcam

export interface SampleImage {
  id: string;
  nameKz: string;
  nameRu: string;
  nameEn: string;
  expectedClass: string;
  src: string;
}

// Generate sleek SVG data URIs
function makeSvg(svgContent: string): string {
  const full = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480" fill="#0f172a">${svgContent}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(full)}`;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'apple',
    nameKz: 'Алма',
    nameRu: 'Яблоко',
    nameEn: 'Apple',
    expectedClass: 'apple',
    src: makeSvg(`
      <rect width="640" height="480" fill="#0d1527"/>
      <circle cx="320" cy="270" r="130" fill="#ef4444"/>
      <path d="M 320 140 Q 300 90 270 70 Q 310 80 320 140" fill="#15803d"/>
      <path d="M 320 140 Q 340 100 380 90 Q 360 120 320 140" fill="#22c55e"/>
      <ellipse cx="270" cy="230" rx="20" ry="40" fill="#fca5a5" opacity="0.6"/>
      <text x="320" y="440" font-family="sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Үлгі нысан: Қызыл алма</text>
    `)
  },
  {
    id: 'cup',
    nameKz: 'Кесе (Шыныаяқ)',
    nameRu: 'Чашка',
    nameEn: 'Cup',
    expectedClass: 'cup',
    src: makeSvg(`
      <rect width="640" height="480" fill="#0d1527"/>
      <!-- Mug Body -->
      <path d="M 230 180 L 250 360 C 255 380 385 380 390 360 L 410 180 Z" fill="#0284c7"/>
      <ellipse cx="320" cy="180" rx="90" ry="25" fill="#38bdf8"/>
      <!-- Handle -->
      <path d="M 400 210 C 470 210 470 330 385 330" fill="none" stroke="#0284c7" stroke-width="24" stroke-linecap="round"/>
      <!-- Steam -->
      <path d="M 300 140 Q 290 100 310 70" fill="none" stroke="#94a3b8" stroke-width="4" stroke-dasharray="6,6"/>
      <path d="M 340 140 Q 350 100 330 70" fill="none" stroke="#94a3b8" stroke-width="4" stroke-dasharray="6,6"/>
      <text x="320" y="440" font-family="sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Үлгі нысан: Ыстық шәй кесесі</text>
    `)
  },
  {
    id: 'laptop',
    nameKz: 'Ноутбук',
    nameRu: 'Ноутбук',
    nameEn: 'Laptop',
    expectedClass: 'laptop',
    src: makeSvg(`
      <rect width="640" height="480" fill="#0d1527"/>
      <!-- Screen -->
      <rect x="170" y="110" width="300" height="190" rx="10" fill="#334155" stroke="#64748b" stroke-width="4"/>
      <rect x="185" y="125" width="270" height="160" rx="4" fill="#0284c7"/>
      <circle cx="320" cy="205" r="30" fill="#38bdf8" opacity="0.8"/>
      <!-- Keyboard Base -->
      <path d="M 110 320 L 530 320 L 500 360 L 140 360 Z" fill="#475569"/>
      <rect x="270" y="335" width="100" height="16" rx="3" fill="#334155"/>
      <text x="320" y="440" font-family="sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Үлгі нысан: Ноутбук</text>
    `)
  },
  {
    id: 'book',
    nameKz: 'Кітап',
    nameRu: 'Книга',
    nameEn: 'Book',
    expectedClass: 'book',
    src: makeSvg(`
      <rect width="640" height="480" fill="#0d1527"/>
      <!-- Open Book -->
      <path d="M 320 340 C 260 320 180 320 140 340 L 140 160 C 180 140 260 140 320 160 Z" fill="#f8fafc"/>
      <path d="M 320 340 C 380 320 460 320 500 340 L 500 160 C 460 140 380 140 320 160 Z" fill="#e2e8f0"/>
      <!-- Spine -->
      <line x1="320" y1="160" x2="320" y2="340" stroke="#f59e0b" stroke-width="6"/>
      <!-- Lines of text -->
      <line x1="170" y1="190" x2="280" y2="190" stroke="#cbd5e1" stroke-width="4"/>
      <line x1="170" y1="220" x2="290" y2="220" stroke="#cbd5e1" stroke-width="4"/>
      <line x1="170" y1="250" x2="270" y2="250" stroke="#cbd5e1" stroke-width="4"/>
      <line x1="350" y1="190" x2="470" y2="190" stroke="#94a3b8" stroke-width="4"/>
      <line x1="350" y1="220" x2="460" y2="220" stroke="#94a3b8" stroke-width="4"/>
      <line x1="350" y1="250" x2="440" y2="250" stroke="#94a3b8" stroke-width="4"/>
      <text x="320" y="440" font-family="sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Үлгі нысан: Кітап</text>
    `)
  }
];