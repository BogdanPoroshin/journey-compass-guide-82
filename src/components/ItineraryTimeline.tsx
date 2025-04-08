
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Globe, Phone } from "lucide-react";

interface PointOfInterest {
  id: number;
  name: string;
  description: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  stayDuration?: number; // in minutes
  notes?: string;
  websiteUrl?: string;
  contactInfo?: string;
  openingHours?: string;
}

interface ItineraryTimelineProps {
  points: PointOfInterest[];
  className?: string;
}

const ItineraryTimeline = ({ points, className = "" }: ItineraryTimelineProps) => {
  const getPointTypeIcon = (type: string) => {
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
      case 'activity':
        return '🏄‍♂️';
      case 'transport':
        return '🚗';
      default:
        return '📍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'restaurant':
        return 'bg-orange-500';
      case 'hotel':
      case 'accommodation':
        return 'bg-blue-500';
      case 'landmark':
      case 'attraction':
        return 'bg-purple-500';
      case 'beach':
        return 'bg-cyan-500';
      case 'park':
        return 'bg-green-500';
      case 'museum':
        return 'bg-amber-500';
      case 'activity':
        return 'bg-pink-500';
      case 'transport':
        return 'bg-gray-500';
      default:
        return 'bg-travel-primary';
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Itinerary</span>
          <Badge variant="outline">{points.length} stops</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {points.map((point, index) => (
            <div key={point.id} className="relative flex mb-8 last:mb-0">
              {/* Timeline line */}
              {index < points.length - 1 && (
                <div className="absolute top-10 bottom-0 left-5 w-0.5 bg-gray-200"></div>
              )}
              
              {/* Timeline point */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full z-10 flex-shrink-0 ${getTypeColor(point.type)}`}>
                <div className="text-white font-bold">{getPointTypeIcon(point.type)}</div>
              </div>
              
              {/* Content */}
              <div className="ml-4 flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{point.name}</h3>
                  {point.stayDuration && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(point.stayDuration)}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground mb-2 flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1 inline text-travel-primary" />
                  {point.address || 'No address provided'}
                </div>
                
                <p className="text-sm mb-3">{point.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {point.websiteUrl && (
                    <div className="flex items-center">
                      <Globe className="h-3.5 w-3.5 mr-1.5" />
                      <a 
                        href={point.websiteUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-travel-primary hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  
                  {point.contactInfo && (
                    <div className="flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-1.5" />
                      <span>{point.contactInfo}</span>
                    </div>
                  )}
                  
                  {point.openingHours && (
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <span>{point.openingHours}</span>
                    </div>
                  )}
                </div>
                
                {point.notes && (
                  <div className="mt-3 bg-muted p-3 rounded-lg text-sm italic">
                    <p>{point.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItineraryTimeline;
