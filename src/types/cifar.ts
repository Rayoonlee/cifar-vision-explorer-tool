// TypeScript interfaces for CIFAR-10 classification

export interface CIFARImage {
  id: string;
  data: ImageData | HTMLImageElement | string;
  label?: string;
  confidence?: number;
}

export interface PredictionResult {
  predictions: Array<{
    className: string;
    confidence: number;
    index: number;
  }>;
  topPrediction: {
    className: string;
    confidence: number;
    index: number;
  };
  processingTime: number;
}

export interface ModelStatus {
  status: 'idle' | 'loading' | 'loaded' | 'error';
  error?: string;
  loadingProgress?: number;
}

export const CIFAR_CLASSES = [
  'airplane',
  'automobile', 
  'bird',
  'cat',
  'deer',
  'dog',
  'frog',
  'horse',
  'ship',
  'truck'
] as const;

export type CIFARClass = typeof CIFAR_CLASSES[number];

export interface DatasetViewerState {
  currentImage: CIFARImage | null;
  selectedClass: CIFARClass | 'all';
  imageGrid: CIFARImage[];
  isLoading: boolean;
}

export interface UploadState {
  uploadedImage: File | null;
  previewUrl: string | null;
  isProcessing: boolean;
  prediction: PredictionResult | null;
}