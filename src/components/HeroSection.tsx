import { Brain, Image as ImageIcon, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="relative py-16 px-4 bg-gradient-primary">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Brain className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            CIFAR-10 Explorer
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Interactive machine learning demo for image classification. Upload your own images 
            or explore the CIFAR-10 dataset with real-time AI predictions.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <ImageIcon className="h-8 w-8 text-primary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                  Explore Dataset
                </h3>
                <p className="text-primary-foreground/80 text-sm">
                  Browse 10 classes of 32x32 images from the CIFAR-10 dataset
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Upload className="h-8 w-8 text-primary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                  Upload & Predict
                </h3>
                <p className="text-primary-foreground/80 text-sm">
                  Upload your own images and get instant AI predictions
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Brain className="h-8 w-8 text-primary-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                  Real-time ML
                </h3>
                <p className="text-primary-foreground/80 text-sm">
                  See confidence scores and model predictions in real-time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}