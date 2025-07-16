
import { useMemo } from "react";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

interface TrainingLog {
  epoch: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
  learningRate: number;
  timestamp: Date;
}

interface TrainingMetricsProps {
  logs: TrainingLog[];
}

export function TrainingMetrics({ logs }: TrainingMetricsProps) {
  const chartData = useMemo(() => {
    return logs.map(log => ({
      epoch: log.epoch,
      loss: log.loss,
      accuracy: log.accuracy * 100,
      valLoss: log.valLoss,
      valAccuracy: log.valAccuracy * 100,
      learningRate: log.learningRate
    }));
  }, [logs]);

  const analysis = useMemo(() => {
    if (logs.length < 5) return null;

    const recent = logs.slice(-5);
    const early = logs.slice(0, 5);
    
    const avgRecentValLoss = recent.reduce((sum, log) => sum + log.valLoss, 0) / recent.length;
    const avgRecentTrainLoss = recent.reduce((sum, log) => sum + log.loss, 0) / recent.length;
    
    const isOverfitting = avgRecentValLoss > avgRecentTrainLoss * 1.15;
    const isConverging = recent.every((log, i) => i === 0 || log.loss <= recent[i-1].loss * 1.05);
    
    const bestValAcc = Math.max(...logs.map(log => log.valAccuracy));
    const currentValAcc = logs[logs.length - 1].valAccuracy;
    
    const isImproving = currentValAcc >= bestValAcc * 0.98;

    return {
      isOverfitting,
      isConverging,
      isImproving,
      bestValAccuracy: bestValAcc,
      currentValAccuracy: currentValAcc,
      gapSize: avgRecentValLoss - avgRecentTrainLoss
    };
  }, [logs]);

  const chartConfig = {
    loss: {
      label: "Training Loss",
      color: "hsl(var(--chart-1))",
    },
    valLoss: {
      label: "Validation Loss",
      color: "hsl(var(--chart-2))",
    },
    accuracy: {
      label: "Training Accuracy",
      color: "hsl(var(--chart-3))",
    },
    valAccuracy: {
      label: "Validation Accuracy",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Analysis Cards */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Overfitting Status</p>
                  <p className="text-2xl font-bold">
                    {analysis.isOverfitting ? "Detected" : "Good"}
                  </p>
                </div>
                {analysis.isOverfitting ? (
                  <AlertCircle className="h-8 w-8 text-destructive" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-success" />
                )}
              </div>
              <Badge variant={analysis.isOverfitting ? "destructive" : "default"} className="mt-2">
                Gap: {(analysis.gapSize * 100).toFixed(1)}%
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Convergence</p>
                  <p className="text-2xl font-bold">
                    {analysis.isConverging ? "Stable" : "Unstable"}
                  </p>
                </div>
                {analysis.isConverging ? (
                  <TrendingDown className="h-8 w-8 text-success" />
                ) : (
                  <TrendingUp className="h-8 w-8 text-warning" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Loss trend over recent epochs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Best Val Accuracy</p>
                  <p className="text-2xl font-bold">
                    {(analysis.bestValAccuracy * 100).toFixed(1)}%
                  </p>
                </div>
                <Badge variant={analysis.isImproving ? "default" : "secondary"}>
                  {analysis.isImproving ? "Improving" : "Plateaued"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Current: {(analysis.currentValAccuracy * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loss Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Training & Validation Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="loss" 
                  stroke="var(--color-loss)" 
                  strokeWidth={2}
                  name="Training Loss"
                />
                <Line 
                  type="monotone" 
                  dataKey="valLoss" 
                  stroke="var(--color-valLoss)" 
                  strokeWidth={2}
                  name="Validation Loss"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Accuracy Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Training & Validation Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="var(--color-accuracy)" 
                  strokeWidth={2}
                  name="Training Accuracy (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="valAccuracy" 
                  stroke="var(--color-valAccuracy)" 
                  strokeWidth={2}
                  name="Validation Accuracy (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Training Recommendations */}
      {analysis && analysis.isOverfitting && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Overfitting Detected - Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Consider reducing model complexity (fewer layers/parameters)</li>
              <li>Increase dropout rate or add regularization (L2)</li>
              <li>Use data augmentation to increase training variety</li>
              <li>Implement early stopping based on validation loss</li>
              <li>Reduce learning rate or use learning rate scheduling</li>
              <li>Increase training data or use transfer learning</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
