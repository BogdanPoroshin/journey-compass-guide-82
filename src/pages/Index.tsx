
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import { getRoutes } from "@/api/supabaseApi";
import { RouteWithDetails } from "@/api/types";
import RouteCard from "@/components/RouteCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, MapPin, Route, Compass, Heart, Star } from "lucide-react";

const Index = () => {
  const { user, loginAsDemoUser } = useUser();
  const [popularRoutes, setPopularRoutes] = useState<RouteWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      const routes = await getRoutes();
      // Сортируем по рейтингу и берем первые 3
      const popular = [...routes].sort((a, b) => b.rating - a.rating).slice(0, 3);
      setPopularRoutes(popular);
      setLoading(false);
    };

    fetchRoutes();
  }, []);

  const handleDemoLogin = async () => {
    await loginAsDemoUser();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero section */}
      <section className="bg-travel-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Открывайте удивительные<br />
                <span className="text-travel-primary">маршруты путешествий</span>
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Исследуйте, планируйте и делитесь лучшими маршрутами путешествий со всего мира. 
                Найдите идеальное приключение или создайте свой собственный маршрут!
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-travel-primary hover:bg-travel-primary/90">
                  <Link to="/routes">Исследовать маршруты</Link>
                </Button>
                
                {!user && (
                  <Button onClick={handleDemoLogin} variant="outline" size="lg">
                    Демо-режим
                  </Button>
                )}
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                  alt="Удивительное путешествие"
                  className="rounded-lg shadow-lg w-full object-cover"
                  style={{ height: "500px" }}
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-travel-primary h-5 w-5" />
                    <span className="font-medium">Исследуйте новые места</span>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <div className="flex items-center gap-2">
                    <Route className="text-travel-primary h-5 w-5" />
                    <span className="font-medium">Планируйте маршруты</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Почему стоит использовать нашу платформу</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Мы предлагаем все необходимые инструменты для планирования незабываемых путешествий
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-travel-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Compass className="text-travel-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Экспертные маршруты</h3>
              <p className="text-muted-foreground">
                Доступ к сотням маршрутов, созданных опытными путешественниками со всего мира.
              </p>
            </div>
            
            <div className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-travel-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Heart className="text-travel-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Персонализированные рекомендации</h3>
              <p className="text-muted-foreground">
                Получайте рекомендации по маршрутам, соответствующим вашим интересам и предпочтениям.
              </p>
            </div>
            
            <div className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-travel-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Star className="text-travel-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Создавайте свои маршруты</h3>
              <p className="text-muted-foreground">
                Создавайте собственные маршруты, делитесь ими с друзьями и получайте отзывы от сообщества.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular routes section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Популярные маршруты</h2>
            <Button asChild variant="ghost" className="gap-1 hidden md:flex">
              <Link to="/routes">
                Смотреть все маршруты <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularRoutes.map((route) => (
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
                  isFavorited={route.is_favorited}
                />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline">
              <Link to="/routes">Смотреть все маршруты</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
