
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Layers, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PointOfInterest, Route, RouteWithDetails } from "@/api/types";

interface MapViewProps {
  routes?: Route[];
  selectedRouteId?: string;
  onRouteSelect?: (routeId: string) => void;
  height?: string;
  interactive?: boolean;
  points?: PointOfInterest[];
}

// This is a mock component that would normally integrate with a real map library like Leaflet or Google Maps
const MapView = ({ 
  routes = [], 
  selectedRouteId, 
  onRouteSelect, 
  height = "600px", 
  interactive = true,
  points = []
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentPoint, setCurrentPoint] = useState<PointOfInterest | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // We need to handle the case where Route doesn't have points property
  const displayPoints = points.length > 0 ? points : 
    (selectedRouteId && routes.length > 0) ? 
      (routes.find(route => route.id === selectedRouteId) as RouteWithDetails)?.points || [] : [];

  // This would be replaced with real map initialization
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // This would be replaced with real map markers and routes
  useEffect(() => {
    if (mapLoaded && displayPoints.length > 0) {
      setCurrentPoint(displayPoints[0]);
    }
  }, [mapLoaded, displayPoints]);

  const handleNextPoint = () => {
    if (!currentPoint) return;
    
    const currentIndex = displayPoints.findIndex(p => p.id === currentPoint.id);
    if (currentIndex < displayPoints.length - 1) {
      setCurrentPoint(displayPoints[currentIndex + 1]);
    }
  };

  const handlePrevPoint = () => {
    if (!currentPoint) return;
    
    const currentIndex = displayPoints.findIndex(p => p.id === currentPoint.id);
    if (currentIndex > 0) {
      setCurrentPoint(displayPoints[currentIndex - 1]);
    }
  };

  const getPointTypeIcon = (type: string = '') => {
    switch (type.toLowerCase()) {
      case 'restaurant':
        return '🍽️';
      case 'hotel':
      case 'accommodation':
        return '🏨';
      case 'landmark':
      case 'attraction':
        return '🏛️';
      case 'beach':
        return '🏖️';
      case 'park':
        return '🌳';
      case 'museum':
        return '🏛️';
      default:
        return '📍';
    }
  };

  return (
    <div className="relative w-full rounded-md overflow-hidden" style={{ height }}>
      {/* This would be replaced with the actual map component */}
      <div 
        ref={mapRef} 
        className="w-full h-full bg-slate-200 flex items-center justify-center"
        style={{ 
          backgroundImage: "url('https://source.unsplash.com/random/?map,travel')",
          backgroundSize: "cover",
          backgroundPosition: "center" 
        }}
      >
        {!mapLoaded ? (
          <div className="text-travel-primary">Загрузка карты...</div>
        ) : (
          <div className="absolute inset-0 bg-black/10"></div>
        )}
      </div>
      
      {/* Map controls */}
      {interactive && (
        <div className="absolute top-4 right-4 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="icon" className="h-10 w-10 shadow-md">
                <Layers className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0">
              <div className="p-2">
                <p className="text-xs font-medium mb-2">Слои карты</p>
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                    Стандартная
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                    Спутник
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                    Рельеф
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {/* Route selection */}
      {interactive && (routes.length > 0 || displayPoints.length > 0) && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card>
            <CardContent className="p-3">
              {selectedRouteId && routes.find(r => r.id === selectedRouteId) ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">
                      {routes.find(r => r.id === selectedRouteId)?.title}
                    </h3>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={handlePrevPoint}
                        disabled={!currentPoint || displayPoints.indexOf(currentPoint) === 0}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={handleNextPoint}
                        disabled={!currentPoint || displayPoints.indexOf(currentPoint) === displayPoints.length - 1}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {currentPoint && (
                    <div className="bg-muted p-2 rounded-sm text-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-xl leading-none mt-1">{getPointTypeIcon(currentPoint.type || '')}</span>
                        <div>
                          <p className="font-medium">{currentPoint.name}</p>
                          <p className="text-muted-foreground line-clamp-1">{currentPoint.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : points.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">Точки маршрута</h3>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={handlePrevPoint}
                        disabled={!currentPoint || displayPoints.indexOf(currentPoint) === 0}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={handleNextPoint}
                        disabled={!currentPoint || displayPoints.indexOf(currentPoint) === displayPoints.length - 1}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {currentPoint && (
                    <div className="bg-muted p-2 rounded-sm text-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-xl leading-none mt-1">{getPointTypeIcon(currentPoint.type || '')}</span>
                        <div>
                          <p className="font-medium">{currentPoint.name}</p>
                          <p className="text-muted-foreground line-clamp-1">{currentPoint.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {routes.map(route => (
                    <Badge 
                      key={route.id}
                      onClick={() => onRouteSelect && onRouteSelect(route.id)}
                      className="cursor-pointer hover:bg-travel-primary"
                    >
                      {route.title}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Point details popover */}
      {currentPoint && (
        <div className="absolute pointer-events-none" style={{ 
          top: '50%', 
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <div className="bg-travel-primary text-white p-1 rounded-full shadow-lg">
            <div className="h-6 w-6 flex items-center justify-center">
              {getPointTypeIcon(currentPoint.type || '')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
