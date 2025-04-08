
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import MapView from "@/components/MapView";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getRouteById, toggleFavorite } from "@/api/supabaseApi";
import { useUser } from "@/contexts/UserContext";
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  Share2, 
  Heart, 
  Calendar,
  ArrowLeft
} from "lucide-react";

const RouteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      const routeData = await getRouteById(id, user?.id);
      
      if (routeData) {
        setRoute(routeData);
        setIsFavorited(routeData.is_favorited || false);
      }
      
      setLoading(false);
    };

    fetchRouteDetails();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    if (!user || !id) return;
    
    const result = await toggleFavorite(id, user.id);
    
    if (result !== null) {
      setIsFavorited(result);
    }
  };

  // Получаем форматированные отзывы
  const getFormattedReviews = () => {
    if (!route || !route.reviews) return [];
    
    return route.reviews.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      visitedDate: review.visited_date,
      createdAt: review.created_at,
      user: {
        id: review.user_id,
        username: review.user.username,
        profileImage: review.user.profile_image_url
      },
      isCurrentUserReview: user && review.user_id === user.id
    }));
  };

  // Получаем цвет сложности маршрута
  const getDifficultyColor = (level: string) => {
    if (!level) return "bg-blue-500";
    
    level = level.toLowerCase();
    if (level.includes("легк")) return "bg-green-500";
    if (level.includes("средн")) return "bg-yellow-500";
    if (level.includes("сложн")) return "bg-orange-500";
    if (level.includes("экстрем")) return "bg-red-500";
    return "bg-blue-500";
  };

  const handleAddReview = () => {
    // Перезагружаем данные маршрута для получения обновленных отзывов
    if (id) {
      getRouteById(id, user?.id).then(routeData => {
        if (routeData) {
          setRoute(routeData);
        }
      });
    }
  };

  // Маршрутные точки
  const routePoints = route?.route_points?.map((point: any) => point.point) || [];

  // Вычисляем, оставил ли текущий пользователь отзыв
  const hasUserReviewed = user && route?.reviews?.some((review: any) => review.user_id === user.id);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {loading ? (
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-24" />
              </div>
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        ) : route ? (
          <>
            {/* Hero section */}
            <div className="relative">
              <div className="h-[400px] md:h-[500px] w-full relative">
                <img
                  src={route.image_url || `https://source.unsplash.com/random/?travel,${route.title}`}
                  alt={route.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
                <Link to="/routes" className="text-white flex items-center gap-1 mb-4 hover:underline">
                  <ArrowLeft className="h-4 w-4" />
                  Назад к маршрутам
                </Link>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {route.categories.map((category: any) => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="bg-travel-accent/90 text-white border-none"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {route.title}
                </h1>
                
                <div className="flex items-center gap-4 text-white">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarImage src={route.creator.profile_image_url} alt={route.creator.username} />
                      <AvatarFallback className="bg-travel-primary text-white">
                        {route.creator.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{route.creator.username}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(route.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Route details section */}
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Info cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-background rounded-lg p-4 border shadow-sm flex flex-col items-center justify-center text-center">
                      <Clock className="h-6 w-6 text-travel-primary mb-2" />
                      <div className="text-sm text-muted-foreground">Продолжительность</div>
                      <div className="font-semibold">{route.duration} {route.duration === 1 ? "день" : route.duration > 1 && route.duration < 5 ? "дня" : "дней"}</div>
                    </div>
                    
                    {route.distance && (
                      <div className="bg-background rounded-lg p-4 border shadow-sm flex flex-col items-center justify-center text-center">
                        <MapPin className="h-6 w-6 text-travel-primary mb-2" />
                        <div className="text-sm text-muted-foreground">Расстояние</div>
                        <div className="font-semibold">{route.distance} км</div>
                      </div>
                    )}
                    
                    {route.difficulty_level && (
                      <div className="bg-background rounded-lg p-4 border shadow-sm flex flex-col items-center justify-center text-center">
                        <div className={`w-3 h-3 rounded-full mb-2 ${getDifficultyColor(route.difficulty_level)}`} />
                        <div className="text-sm text-muted-foreground">Сложность</div>
                        <div className="font-semibold">{route.difficulty_level}</div>
                      </div>
                    )}
                    
                    {route.estimated_cost && (
                      <div className="bg-background rounded-lg p-4 border shadow-sm flex flex-col items-center justify-center text-center">
                        <DollarSign className="h-6 w-6 text-travel-primary mb-2" />
                        <div className="text-sm text-muted-foreground">Ориентировочная стоимость</div>
                        <div className="font-semibold">{route.estimated_cost.toLocaleString()} ₽</div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mb-8">
                    {user && (
                      <Button 
                        variant={isFavorited ? "secondary" : "outline"}
                        onClick={handleFavoriteToggle}
                        className={`gap-2 ${isFavorited ? "bg-travel-primary/10" : ""}`}
                      >
                        <Heart className={`h-5 w-5 ${isFavorited ? "fill-travel-primary text-travel-primary" : ""}`} />
                        {isFavorited ? "В избранном" : "Добавить в избранное"}
                      </Button>
                    )}
                    
                    <Button variant="outline" className="gap-2">
                      <Share2 className="h-5 w-5" />
                      Поделиться
                    </Button>
                  </div>

                  {/* Description */}
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-4">Описание</h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {route.description}
                    </p>
                  </div>

                  {/* Tabs for itinerary and map */}
                  <Tabs defaultValue="itinerary" className="mb-10">
                    <TabsList>
                      <TabsTrigger value="itinerary">Маршрут</TabsTrigger>
                      <TabsTrigger value="map">Карта</TabsTrigger>
                    </TabsList>
                    <TabsContent value="itinerary" className="pt-4">
                      <ItineraryTimeline points={routePoints} />
                    </TabsContent>
                    <TabsContent value="map" className="pt-4">
                      <div className="h-[400px] border rounded-lg overflow-hidden">
                        <MapView points={routePoints} />
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Reviews section */}
                  <ReviewSection
                    routeId={route.id}
                    reviews={getFormattedReviews()}
                    averageRating={route.rating}
                    totalReviews={route.review_count}
                    hasUserReviewed={hasUserReviewed}
                    onAddReview={handleAddReview}
                    hasMoreReviews={false}
                  />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Sidebar content, можно добавить рекомендации или похожие маршруты */}
                  <div className="sticky top-20">
                    <h3 className="text-xl font-bold mb-4">Дополнительная информация</h3>
                    {/* Здесь может быть дополнительная информация о маршруте */}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Маршрут не найден</h2>
            <p className="text-muted-foreground mb-6">
              Запрашиваемый маршрут не существует или был удален.
            </p>
            <Button asChild>
              <Link to="/routes">Вернуться к маршрутам</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RouteDetail;
