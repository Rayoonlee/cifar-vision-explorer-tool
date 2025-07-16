import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PredictionDisplay } from "./PredictionDisplay";
import { UploadState, PredictionResult } from "@/types/cifar";

interface ImageUploadProps {
  onPrediction?: (result: PredictionResult) => void;
}

export function ImageUpload({ onPrediction }: ImageUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploadedImage: null,
    previewUrl: null,
    isProcessing: false,
    prediction: null
  });

  const handleFileChange = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadState(prev => ({
        ...prev,
        uploadedImage: file,
        previewUrl: e.target?.result as string,
        prediction: null
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const clearImage = useCallback(() => {
    setUploadState({
      uploadedImage: null,
      previewUrl: null,
      isProcessing: false,
      prediction: null
    });
  }, []);

  const simulatePrediction = useCallback(async () => {
    if (!uploadState.uploadedImage) return;

    setUploadState(prev => ({ ...prev, isProcessing: true }));

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock prediction result
    const mockResult: PredictionResult = {
      predictions: [
        { className: 'cat', confidence: 0.85, index: 3 },
        { className: 'dog', confidence: 0.12, index: 5 },
        { className: 'bird', confidence: 0.02, index: 2 },
        { className: 'horse', confidence: 0.01, index: 7 }
      ],
      topPrediction: { className: 'cat', confidence: 0.85, index: 3 },
      processingTime: 125
    };

    setUploadState(prev => ({
      ...prev,
      isProcessing: false,
      prediction: mockResult
    }));

    onPrediction?.(mockResult);
  }, [uploadState.uploadedImage, onPrediction]);

  return (
    <Card className="shadow-ml">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Your Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          
          {uploadState.previewUrl ? (
            <div className="relative">
              <img
                src={uploadState.previewUrl}
                alt="Uploaded preview"
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-card-custom"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium">Drop an image here or click to browse</p>
                <p className="text-sm text-muted-foreground">Supports PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Predict Button */}
        {uploadState.previewUrl && (
          <Button
            onClick={simulatePrediction}
            disabled={uploadState.isProcessing}
            className="w-full"
            size="lg"
          >
            {uploadState.isProcessing ? "Processing..." : "Classify Image"}
          </Button>
        )}

        {/* Prediction Results */}
        {uploadState.prediction && (
          <PredictionDisplay prediction={uploadState.prediction} />
        )}
      </CardContent>
    </Card>
  );
}