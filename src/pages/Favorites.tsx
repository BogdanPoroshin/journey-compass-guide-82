
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteCard from "@/components/RouteCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import { getFavoriteRoutes, toggleFavorite, RouteWithDetails } from "@/api/supabaseApi";
import { Heart, Compass, ArrowLeft } from "lucide-react";

const FavoritesPage = () => {
  const { user } = useUser();
  const [favoriteRoutes, setFavoriteRoutes] = useState<RouteWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      
      setLoading(true);
      const routes = await getFavoriteRoutes(user.id);
      setFavoriteRoutes(routes);
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  const handleFavoriteToggle = async (routeId: string) => {
    if (!user) return;
    
    await toggleFavorite(routeId, user.id);
    
    // Обновляем список избранных маршрутов
    setFavoriteRoutes(favoriteRoutes.filter(route => route.id !== routeId));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/routes" className="text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Назад к маршрутам
            </Link>
            <h1 className="text-3xl font-bold">Избранные маршруты</h1>
          </div>

          {!user ? (
            <div className="text-center py-12 bg-background rounded-lg border shadow-sm">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Войдите, чтобы увидеть избранное</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Для просмотра и управления избранными маршрутами необходимо войти в систему
              </p>
              <Button onClick={() => window.location.href="/"} className="bg-travel-primary hover:bg-travel-primary/90">
                На главную
              </Button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden bg-background">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex flex-wrap gap-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : favoriteRoutes.length === 0 ? (
            <div className="text-center py-12 bg-background rounded-lg border shadow-sm">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">У вас пока нет избранных маршрутов</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Добавляйте понравившиеся маршруты в избранное, чтобы легко находить их в будущем
              </p>
              <Button asChild className="bg-travel-primary hover:bg-travel-primary/90">
                <Link to="/routes">
                  <Compass className="h-4 w-4 mr-2" />
                  Исследовать маршруты
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    id={route.id}
                    title={route.title}
                    description={route.description}
                    imageUrl={route.image_url || `https://source.unsplash.com/random/?travel,${route.title}`}
                    duration={route.duration}
                    distance={route.distance}
                    difficulty={route.difficulty_level || "Средний"}
                    cost={route.estimated_cost}
                    rating={route.rating}
                    reviewCount={route.review_count}
                    categories={route.categories}
                    creator={route.creator}
                    isFavorited={true}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage;
