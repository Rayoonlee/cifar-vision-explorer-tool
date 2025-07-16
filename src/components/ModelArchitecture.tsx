
import { Layers, ArrowDown, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LayerInfo {
  name: string;
  type: 'conv2d' | 'maxpool' | 'dropout' | 'flatten' | 'dense';
  outputShape: string;
  parameters: number;
  details: string;
}

const modelLayers: LayerInfo[] = [
  {
    name: "Input Layer",
    type: 'conv2d',
    outputShape: "(32, 32, 3)",
    parameters: 0,
    details: "CIFAR-10 RGB images"
  },
  {
    name: "Conv2D + ReLU",
    type: 'conv2d',
    outputShape: "(30, 30, 32)",
    parameters: 896,
    details: "32 filters, 3x3 kernel, no padding"
  },
  {
    name: "Conv2D + ReLU", 
    type: 'conv2d',
    outputShape: "(28, 28, 32)",
    parameters: 9248,
    details: "32 filters, 3x3 kernel, no padding"
  },
  {
    name: "MaxPooling2D",
    type: 'maxpool',
    outputShape: "(14, 14, 32)",
    parameters: 0,
    details: "2x2 pool size, stride 2"
  },
  {
    name: "Dropout",
    type: 'dropout',
    outputShape: "(14, 14, 32)",
    parameters: 0,
    details: "Rate: 0.25"
  },
  {
    name: "Conv2D + ReLU",
    type: 'conv2d', 
    outputShape: "(12, 12, 64)",
    parameters: 18496,
    details: "64 filters, 3x3 kernel, no padding"
  },
  {
    name: "Conv2D + ReLU",
    type: 'conv2d',
    outputShape: "(10, 10, 64)", 
    parameters: 36928,
    details: "64 filters, 3x3 kernel, no padding"
  },
  {
    name: "MaxPooling2D",
    type: 'maxpool',
    outputShape: "(5, 5, 64)",
    parameters: 0,
    details: "2x2 pool size, stride 2"
  },
  {
    name: "Dropout",
    type: 'dropout',
    outputShape: "(5, 5, 64)",
    parameters: 0,
    details: "Rate: 0.25"
  },
  {
    name: "Flatten",
    type: 'flatten',
    outputShape: "(1600,)",
    parameters: 0,
    details: "5 × 5 × 64 = 1600"
  },
  {
    name: "Dense + ReLU",
    type: 'dense',
    outputShape: "(512,)",
    parameters: 819712,
    details: "512 neurons, ReLU activation"
  },
  {
    name: "Dropout",
    type: 'dropout',
    outputShape: "(512,)",
    parameters: 0,
    details: "Rate: 0.5"
  },
  {
    name: "Dense + Softmax",
    type: 'dense',
    outputShape: "(10,)",
    parameters: 5130,
    details: "10 classes, softmax activation"
  }
];

const getLayerColor = (type: LayerInfo['type']) => {
  switch (type) {
    case 'conv2d': return 'bg-blue-500/10 border-blue-500/30 text-blue-700';
    case 'maxpool': return 'bg-green-500/10 border-green-500/30 text-green-700';
    case 'dropout': return 'bg-orange-500/10 border-orange-500/30 text-orange-700';
    case 'flatten': return 'bg-purple-500/10 border-purple-500/30 text-purple-700';
    case 'dense': return 'bg-red-500/10 border-red-500/30 text-red-700';
    default: return 'bg-gray-500/10 border-gray-500/30 text-gray-700';
  }
};

const getLayerIcon = (type: LayerInfo['type']) => {
  switch (type) {
    case 'conv2d': return '⬜';
    case 'maxpool': return '⬇️';
    case 'dropout': return '🎲';
    case 'flatten': return '📏';
    case 'dense': return '🔗';
    default: return '⚪';
  }
};

export function ModelArchitecture() {
  const totalParams = modelLayers.reduce((sum, layer) => sum + layer.parameters, 0);
  const trainableParams = totalParams; // All params are trainable in this simple model

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          CNN Model Architecture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Parameters</p>
            <p className="text-xl font-bold">{totalParams.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Trainable Parameters</p>
            <p className="text-xl font-bold">{trainableParams.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Model Size</p>
            <p className="text-xl font-bold">~{(totalParams * 4 / 1024 / 1024).toFixed(1)}MB</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Layers</p>
            <p className="text-xl font-bold">{modelLayers.length}</p>
          </div>
        </div>

        {/* Architecture Visualization */}
        <div className="space-y-2">
          {modelLayers.map((layer, index) => (
            <div key={index} className="relative">
              <div className={`p-4 rounded-lg border-2 ${getLayerColor(layer.type)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getLayerIcon(layer.type)}</span>
                    <div>
                      <h4 className="font-semibold">{layer.name}</h4>
                      <p className="text-sm opacity-80">{layer.details}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {layer.outputShape}
                    </Badge>
                    {layer.parameters > 0 && (
                      <p className="text-sm font-mono">
                        {layer.parameters.toLocaleString()} params
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Arrow between layers */}
              {index < modelLayers.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Architecture Notes */}
        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <h4 className="font-semibold text-info mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Architecture Notes
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Convolutional Layers:</strong> Extract spatial features using learnable filters</p>
            <p><strong>MaxPooling:</strong> Reduces spatial dimensions and adds translation invariance</p>
            <p><strong>Dropout:</strong> Prevents overfitting by randomly setting neurons to zero during training</p>
            <p><strong>Dense Layers:</strong> Fully connected layers for final classification</p>
            <p><strong>Softmax:</strong> Converts final layer outputs to class probabilities</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
