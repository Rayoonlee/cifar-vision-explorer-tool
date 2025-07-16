import { Trophy, Clock, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PredictionResult } from "@/types/cifar";

interface PredictionDisplayProps {
  prediction: PredictionResult;
}

export function PredictionDisplay({ prediction }: PredictionDisplayProps) {
  const { topPrediction, predictions, processingTime } = prediction;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return "bg-success";
    if (confidence >= 0.4) return "bg-warning";
    return "bg-destructive";
  };

  const getConfidenceVariant = (confidence: number): "default" | "secondary" | "destructive" | "outline" => {
    if (confidence >= 0.7) return "default";
    if (confidence >= 0.4) return "secondary";
    return "destructive";
  };

  return (
    <Card className="bg-gradient-secondary border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Prediction Results
          </span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {processingTime}ms
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Prediction */}
        <div className="bg-card p-4 rounded-lg border shadow-card-custom">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="font-semibold">Top Prediction</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold capitalize">{topPrediction.className}</span>
            <Badge variant={getConfidenceVariant(topPrediction.confidence)} className="text-lg px-3 py-1">
              {(topPrediction.confidence * 100).toFixed(1)}%
            </Badge>
          </div>
        </div>

        {/* All Predictions */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Confidence Breakdown
          </h4>
          {predictions.map((pred, index) => (
            <div key={pred.className} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="capitalize font-medium">{pred.className}</span>
                <span className="text-sm text-muted-foreground">
                  {(pred.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={pred.confidence * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
          <p>
            <strong>Model:</strong> CIFAR-10 CNN Classifier (Demo Mode)
          </p>
          <p>
            <strong>Input:</strong> 32x32 RGB Images, 10 Classes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}