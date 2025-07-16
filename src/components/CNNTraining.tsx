
import { useState, useCallback, useRef } from "react";
import { Play, Pause, Square, Brain, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrainingMetrics } from "./TrainingMetrics";
import { ModelArchitecture } from "./ModelArchitecture";

interface TrainingLog {
  epoch: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
  learningRate: number;
  timestamp: Date;
}

interface TrainingState {
  isTraining: boolean;
  isPaused: boolean;
  currentEpoch: number;
  totalEpochs: number;
  logs: TrainingLog[];
  status: 'idle' | 'preparing' | 'training' | 'paused' | 'completed' | 'error';
  error?: string;
}

export function CNNTraining() {
  const [trainingState, setTrainingState] = useState<TrainingState>({
    isTraining: false,
    isPaused: false,
    currentEpoch: 0,
    totalEpochs: 50,
    logs: [],
    status: 'idle'
  });

  const [hyperparameters, setHyperparameters] = useState({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 50,
    optimizer: 'adam',
    augmentation: true
  });

  const trainingRef = useRef<boolean>(false);

  // Simulate training progress with realistic CIFAR-10 metrics
  const simulateTraining = useCallback(async () => {
    trainingRef.current = true;
    setTrainingState(prev => ({
      ...prev,
      isTraining: true,
      status: 'preparing',
      logs: []
    }));

    // Simulate data preparation
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!trainingRef.current) return;

    setTrainingState(prev => ({ ...prev, status: 'training' }));

    for (let epoch = 1; epoch <= hyperparameters.epochs && trainingRef.current; epoch++) {
      // Simulate realistic CIFAR-10 training curves
      const baseAccuracy = Math.min(0.95, 0.1 + (epoch / hyperparameters.epochs) * 0.75);
      const baseValAccuracy = Math.min(0.85, 0.08 + (epoch / hyperparameters.epochs) * 0.65);
      
      // Add some noise and overfitting simulation
      const noise = (Math.random() - 0.5) * 0.05;
      const overfittingFactor = Math.max(0, (epoch - 20) / 30);
      
      const accuracy = Math.max(0, baseAccuracy + noise);
      const valAccuracy = Math.max(0, baseValAccuracy + noise - overfittingFactor * 0.1);
      
      const loss = Math.max(0.01, 2.5 * Math.exp(-epoch / 15) + Math.random() * 0.1);
      const valLoss = Math.max(0.01, loss + overfittingFactor * 0.3 + Math.random() * 0.15);

      const log: TrainingLog = {
        epoch,
        loss,
        accuracy,
        valLoss,
        valAccuracy,
        learningRate: hyperparameters.learningRate * Math.pow(0.95, Math.floor(epoch / 10)),
        timestamp: new Date()
      };

      setTrainingState(prev => ({
        ...prev,
        currentEpoch: epoch,
        logs: [...prev.logs, log]
      }));

      // Simulate epoch training time
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (trainingRef.current) {
      setTrainingState(prev => ({
        ...prev,
        isTraining: false,
        status: 'completed'
      }));
    }
  }, [hyperparameters]);

  const startTraining = useCallback(() => {
    simulateTraining();
  }, [simulateTraining]);

  const pauseTraining = useCallback(() => {
    setTrainingState(prev => ({
      ...prev,
      isPaused: true,
      status: 'paused'
    }));
  }, []);

  const stopTraining = useCallback(() => {
    trainingRef.current = false;
    setTrainingState(prev => ({
      ...prev,
      isTraining: false,
      isPaused: false,
      status: 'idle'
    }));
  }, []);

  const currentLog = trainingState.logs[trainingState.logs.length - 1];
  const isOverfitting = currentLog && currentLog.valLoss > currentLog.loss * 1.2;
  const progressPercentage = (trainingState.currentEpoch / trainingState.totalEpochs) * 100;

  return (
    <div className="space-y-6">
      {/* Training Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            CNN Training Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hyperparameters */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Learning Rate</label>
              <Select 
                value={hyperparameters.learningRate.toString()} 
                onValueChange={(value) => setHyperparameters(prev => ({ ...prev, learningRate: parseFloat(value) }))}
                disabled={trainingState.isTraining}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.01">0.01</SelectItem>
                  <SelectItem value="0.001">0.001</SelectItem>
                  <SelectItem value="0.0001">0.0001</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Batch Size</label>
              <Select 
                value={hyperparameters.batchSize.toString()} 
                onValueChange={(value) => setHyperparameters(prev => ({ ...prev, batchSize: parseInt(value) }))}
                disabled={trainingState.isTraining}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                  <SelectItem value="64">64</SelectItem>
                  <SelectItem value="128">128</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Epochs</label>
              <Select 
                value={hyperparameters.epochs.toString()} 
                onValueChange={(value) => setHyperparameters(prev => ({ ...prev, epochs: parseInt(value), totalEpochs: parseInt(value) }))}
                disabled={trainingState.isTraining}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Optimizer</label>
              <Select 
                value={hyperparameters.optimizer} 
                onValueChange={(value) => setHyperparameters(prev => ({ ...prev, optimizer: value }))}
                disabled={trainingState.isTraining}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adam">Adam</SelectItem>
                  <SelectItem value="sgd">SGD</SelectItem>
                  <SelectItem value="rmsprop">RMSprop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Augmentation</label>
              <Button
                variant={hyperparameters.augmentation ? "default" : "outline"}
                onClick={() => setHyperparameters(prev => ({ ...prev, augmentation: !prev.augmentation }))}
                disabled={trainingState.isTraining}
                className="w-full"
              >
                {hyperparameters.augmentation ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>

          {/* Training Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {!trainingState.isTraining ? (
                <Button onClick={startTraining} disabled={trainingState.status === 'preparing'}>
                  <Play className="h-4 w-4 mr-2" />
                  {trainingState.status === 'preparing' ? 'Preparing...' : 'Start Training'}
                </Button>
              ) : (
                <>
                  <Button onClick={pauseTraining} variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button onClick={stopTraining} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Badge variant={trainingState.status === 'training' ? 'default' : 'secondary'}>
                {trainingState.status.charAt(0).toUpperCase() + trainingState.status.slice(1)}
              </Badge>
              {isOverfitting && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Overfitting Detected
                </Badge>
              )}
            </div>
          </div>

          {/* Training Progress */}
          {trainingState.isTraining && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Epoch {trainingState.currentEpoch} / {trainingState.totalEpochs}</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              
              {currentLog && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Loss:</span> {currentLog.loss.toFixed(4)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Accuracy:</span> {(currentLog.accuracy * 100).toFixed(2)}%
                  </div>
                  <div>
                    <span className="text-muted-foreground">Val Loss:</span> {currentLog.valLoss.toFixed(4)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Val Accuracy:</span> {(currentLog.valAccuracy * 100).toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Architecture */}
      <ModelArchitecture />

      {/* Training Metrics */}
      {trainingState.logs.length > 0 && (
        <TrainingMetrics logs={trainingState.logs} />
      )}
    </div>
  );
}
