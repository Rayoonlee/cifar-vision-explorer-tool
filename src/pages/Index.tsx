import { HeroSection } from "@/components/HeroSection";
import { ImageUpload } from "@/components/ImageUpload";
import { DatasetViewer } from "@/components/DatasetViewer";
import { PredictionResult } from "@/types/cifar";

const Index = () => {
  const handlePrediction = (result: PredictionResult) => {
    console.log('Prediction result:', result);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
            <ImageUpload onPrediction={handlePrediction} />
          </div>
          
          {/* Right Column - Dataset Viewer */}
          <div className="space-y-6">
            <DatasetViewer />
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-16 text-center text-muted-foreground">
          <div className="max-w-2xl mx-auto">
            <p className="mb-4">
              This is a demo application showcasing image classification using the CIFAR-10 dataset. 
              In a production environment, this would connect to a real TensorFlow.js model for inference.
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <span><strong>Dataset:</strong> CIFAR-10</span>
              <span><strong>Model:</strong> CNN Classifier</span>
              <span><strong>Framework:</strong> TensorFlow.js</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
