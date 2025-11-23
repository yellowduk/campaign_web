export enum PosterVibe {
  TRUCK = 'Lukisan Bak Truk',
  MINIMALIST = 'Minimalist',
  BOLD = 'Bold & Aggressive',
  VIBRANT = 'Vibrant & Neon',
  ILLUSTRATED = 'Hand-Drawn Illustration',
  GRUNGE = 'Grunge & Street',
  CUSTOM = 'Custom Chaos'
}

export enum PaperSize {
  A5 = 'A5',
  A4 = 'A4',
  A3 = 'A3',
  INSTAGRAM_STORY = 'Story (9:16)',
  SQUARE = 'Square (1:1)'
}

export interface PosterConfig {
  vibe: PosterVibe;
  size: PaperSize;
  customText: string;
  generatedImageUrl?: string;
}

export interface PinboardPost {
  id: string;
  imageUrl: string;
  caption: string;
  location: string;
  timestamp: number;
}

export const PAPER_DIMENSIONS: Record<PaperSize, { width: number; height: number; label: string; ratio: number }> = {
  [PaperSize.A5]: { width: 1748, height: 2480, label: 'A5 (148 x 210 mm)', ratio: 148/210 },
  [PaperSize.A4]: { width: 2480, height: 3508, label: 'A4 (210 x 297 mm)', ratio: 210/297 },
  [PaperSize.A3]: { width: 3508, height: 4961, label: 'A3 (297 x 420 mm)', ratio: 297/420 },
  [PaperSize.INSTAGRAM_STORY]: { width: 1080, height: 1920, label: 'Story (9:16)', ratio: 9/16 },
  [PaperSize.SQUARE]: { width: 2000, height: 2000, label: 'Square (1:1)', ratio: 1 },
};