import { useState, useCallback } from "react";
import { Shuffle, Filter, Grid3X3, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CIFAR_CLASSES, CIFARClass, DatasetViewerState, CIFARImage } from "@/types/cifar";

// Mock CIFAR-10 images (in a real app, these would come from your dataset)
const MOCK_IMAGES: CIFARImage[] = [
  { id: '1', data: '/placeholder.svg', label: 'airplane' },
  { id: '2', data: '/placeholder.svg', label: 'cat' },
  { id: '3', data: '/placeholder.svg', label: 'dog' },
  { id: '4', data: '/placeholder.svg', label: 'bird' },
  { id: '5', data: '/placeholder.svg', label: 'automobile' },
  { id: '6', data: '/placeholder.svg', label: 'ship' },
];

export function DatasetViewer() {
  const [viewerState, setViewerState] = useState<DatasetViewerState>({
    currentImage: null,
    selectedClass: 'all',
    imageGrid: MOCK_IMAGES,
    isLoading: false
  });

  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');

  const getRandomImage = useCallback(() => {
    setViewerState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate loading time
    setTimeout(() => {
      setViewerState(currentState => {
        const filteredImages = currentState.selectedClass === 'all' 
          ? MOCK_IMAGES 
          : MOCK_IMAGES.filter(img => img.label === currentState.selectedClass);
        
        const randomImage = filteredImages[Math.floor(Math.random() * filteredImages.length)];
        
        return {
          ...currentState,
          currentImage: randomImage,
          isLoading: false
        };
      });
    }, 500);
  }, []);

  const handleClassFilter = useCallback((selectedClass: CIFARClass | 'all') => {
    setViewerState(prev => ({
      ...prev,
      selectedClass,
      currentImage: null,
      imageGrid: selectedClass === 'all' 
        ? MOCK_IMAGES 
        : MOCK_IMAGES.filter(img => img.label === selectedClass)
    }));
  }, []);

  return (
    <Card className="shadow-ml">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            CIFAR-10 Dataset Explorer
          </span>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'single' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('single')}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Filter by Class</label>
            <Select value={viewerState.selectedClass} onValueChange={handleClassFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CIFAR_CLASSES.map(className => (
                  <SelectItem key={className} value={className}>
                    <span className="capitalize">{className}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {viewMode === 'single' && (
            <div className="flex items-end">
              <Button 
                onClick={getRandomImage} 
                disabled={viewerState.isLoading}
                className="flex items-center gap-2"
              >
                <Shuffle className="h-4 w-4" />
                {viewerState.isLoading ? 'Loading...' : 'Random Image'}
              </Button>
            </div>
          )}
        </div>

        {/* Single Image View */}
        {viewMode === 'single' && (
          <div className="text-center">
            {viewerState.currentImage ? (
              <div className="inline-block">
                <div className="bg-muted p-4 rounded-lg inline-block">
                  <img
                    src={viewerState.currentImage.data as string}
                    alt={`CIFAR-10 ${viewerState.currentImage.label}`}
                    className="w-32 h-32 pixelated border-2 border-border rounded"
                  />
                </div>
                <div className="mt-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    <span className="capitalize">{viewerState.currentImage.label}</span>
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="py-12 text-muted-foreground">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Click "Random Image" to explore the dataset</p>
              </div>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {viewerState.imageGrid.map((image) => (
              <div key={image.id} className="text-center">
                <div className="bg-muted p-2 rounded-lg">
                  <img
                    src={image.data as string}
                    alt={`CIFAR-10 ${image.label}`}
                    className="w-16 h-16 pixelated mx-auto border border-border rounded"
                  />
                </div>
                <Badge variant="outline" className="mt-2 text-xs">
                  <span className="capitalize">{image.label}</span>
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <h4 className="font-semibold text-info mb-2">CIFAR-10 Dataset Info</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Total Images:</strong> 60,000 (50,000 training + 10,000 test)</p>
            <p><strong>Image Size:</strong> 32×32 pixels, RGB color</p>
            <p><strong>Classes:</strong> {CIFAR_CLASSES.length} categories</p>
            <p><strong>Images per Class:</strong> 6,000 (5,000 training + 1,000 test)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}