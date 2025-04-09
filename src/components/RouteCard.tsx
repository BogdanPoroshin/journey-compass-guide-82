
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Clock, MapPin, Star, DollarSign, Heart, 
  Mountain, Beach, Buildings, LandPlot, Tent, Compass, 
  Car, Bike, Ship, Palmtree, UtensilsCrossed, Wine
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toggleFavorite } from "@/api/supabaseApi";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface RouteCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: number;
  distance: number | null;
  difficulty: string;
  cost: number | null;
  rating: number;
  reviewCount: number;
  categories: Category[];
  creator: {
    id: string;
    username: string;
    profile_image_url?: string;
  };
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

const RouteCard = ({
  id,
  title,
  description,
  imageUrl,
  duration,
  distance,
  difficulty,
  cost,
  rating,
  reviewCount,
  categories,
  creator,
  isFavorited = false,
  onFavoriteToggle,
}: RouteCardProps) => {
  const { user } = useUser();
  const [favorited, setFavorited] = useState(isFavorited);

  const getDifficultyColor = (level: string) => {
    level = level.toLowerCase();
    if (level.includes("легк")) return "bg-green-500";
    if (level.includes("средн")) return "bg-yellow-500";
    if (level.includes("сложн")) return "bg-orange-500";
    if (level.includes("экстрем")) return "bg-red-500";
    return "bg-blue-500";
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      return;
    }
    
    // Если передан обработчик, используем его
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
      return;
    }
    
    // Иначе добавляем/удаляем из избранного через API
    const result = await toggleFavorite(id, user.id);
    if (result !== null) {
      setFavorited(result);
    }
  };

  // Функция для получения иконки категории
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    
    if (name.includes("горы") || name.includes("mountain")) return <Mountain className="h-3 w-3 mr-1" />;
    if (name.includes("пляж") || name.includes("beach")) return <Beach className="h-3 w-3 mr-1" />;
    if (name.includes("город") || name.includes("city")) return <Buildings className="h-3 w-3 mr-1" />;
    if (name.includes("культур") || name.includes("cultural")) return <LandPlot className="h-3 w-3 mr-1" />;
    if (name.includes("приключен") || name.includes("adventure")) return <Compass className="h-3 w-3 mr-1" />;
    if (name.includes("природа") || name.includes("nature")) return <Palmtree className="h-3 w-3 mr-1" />;
    if (name.includes("еда") || name.includes("food")) return <UtensilsCrossed className="h-3 w-3 mr-1" />;
    if (name.includes("вино") || name.includes("wine")) return <Wine className="h-3 w-3 mr-1" />;
    if (name.includes("авто") || name.includes("road")) return <Car className="h-3 w-3 mr-1" />;
    if (name.includes("велосипед") || name.includes("bike")) return <Bike className="h-3 w-3 mr-1" />;
    if (name.includes("море") || name.includes("water")) return <Ship className="h-3 w-3 mr-1" />;
    
    // Для остальных категорий
    return <Tent className="h-3 w-3 mr-1" />;
  };

  return (
    <Link to={`/routes/${id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 route-card">
        <div className="relative h-48 w-full">
          <img
            src={imageUrl || "https://source.unsplash.com/random/?travel"}
            alt={title}
            className="h-full w-full object-cover"
          />
          {user && (
            <div className="absolute top-3 right-3 z-10">
              <button
                className={`p-2 rounded-full ${
                  favorited
                    ? "bg-travel-highlight text-white"
                    : "bg-black/30 text-white hover:bg-black/50"
                }`}
                onClick={handleFavoriteClick}
              >
                <Heart className={`h-5 w-5 ${favorited ? "fill-current" : ""}`} />
              </button>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 2).map((category) => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className="bg-travel-accent/90 text-travel-secondary border-none text-xs flex items-center"
                >
                  {getCategoryIcon(category.name)}
                  {category.name}
                </Badge>
              ))}
              {categories.length > 2 && (
                <Badge variant="outline" className="bg-black/50 text-white border-none text-xs">
                  +{categories.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-1 line-clamp-1">{title}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-travel-primary" />
              <span>{duration} {duration === 1 ? "день" : duration > 1 && duration < 5 ? "дня" : "дней"}</span>
            </div>

            {distance && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-travel-primary" />
                <span>{distance} км</span>
              </div>
            )}

            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-1.5 ${getDifficultyColor(difficulty)}`}
              />
              <span>{difficulty}</span>
            </div>

            {cost && (
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-travel-primary" />
                <span>{cost.toLocaleString()} ₽</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="px-4 py-3 border-t flex justify-between items-center bg-muted/30">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={creator.profile_image_url} alt={creator.username} />
              <AvatarFallback className="bg-travel-secondary text-xs text-white">
                {creator.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">{creator.username}</span>
          </div>

          <div className="flex items-center">
            <Star className="h-4 w-4 text-travel-accent fill-travel-accent mr-1" />
            <span className="text-sm">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RouteCard;
