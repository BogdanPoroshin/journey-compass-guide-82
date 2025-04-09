
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Map, Star, Search, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRoutes, getCategories } from "@/api/supabaseApi";
import { RouteWithDetails, Category } from "@/api/types";
import { useUser } from "@/contexts/UserContext";
import TelegramBotAdmin from "@/components/TelegramBotAdmin";

export default function Index() {
  const { user } = useUser();
  const [popularRoutes, setPopularRoutes] = useState<RouteWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Получаем маршруты и сортируем по рейтингу
        const routes = await getRoutes();
        const sorted = [...routes].sort((a, b) => b.rating - a.rating).slice(0, 4);
        setPopularRoutes(sorted);
        
        // Получаем категории
        const categories = await getCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Редирект на страницу маршрутов с поисковым запросом
    window.location.href = `/routes?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero секция */}
      <section className="bg-gradient-to-r from-travel-primary/10 to-travel-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Открывайте удивительные маршруты для путешествий</h1>
            <p className="text-xl mb-8">
              Исследуйте уникальные маршруты, созданные путешественниками со всего мира,
              и делитесь своими приключениями
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
              <Input 
                className="max-w-sm"
                placeholder="Поиск маршрутов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="bg-travel-primary hover:bg-travel-primary/90">
                <Search className="h-4 w-4 mr-2" />
                Искать
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              <Link to="/routes">
                <Button variant="outline" className="mb-2">Все маршруты</Button>
              </Link>
              {user && (
                <Link to="/routes/create">
                  <Button className="mb-2 bg-travel-primary hover:bg-travel-primary/90">Создать маршрут</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Популярные маршруты */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Популярные маршруты</h2>
            <Link to="/routes" className="text-travel-primary hover:underline flex items-center">
              Все маршруты <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">Загрузка маршрутов...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularRoutes.map((route) => (
                <Link to={`/routes/${route.id}`} key={route.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={route.image_url || `https://source.unsplash.com/random/?travel,${route.title}`} 
                        alt={route.title}
                        className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                      />
                      {route.categories && route.categories.length > 0 && (
                        <Badge className="absolute top-2 right-2 bg-white/80 text-black">{route.categories[0].name}</Badge>
                      )}
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-xl">{route.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{route.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-travel-primary" />
                          {route.duration} {route.duration === 1 ? 'день' : 'дней'}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-amber-500" />
                          {route.rating.toFixed(1)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Категории маршрутов */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Категории маршрутов</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link 
                to={`/routes?category=${category.id}`} 
                key={category.id}
                className="group"
              >
                <Card className="overflow-hidden h-40 relative group-hover:shadow-lg transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                  <img 
                    src={`https://source.unsplash.com/random/?travel,${category.name}`}
                    alt={category.name}
                    className="object-cover w-full h-full absolute inset-0 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
                    <h3 className="text-white text-xl font-bold">{category.name}</h3>
                    {category.description && (
                      <p className="text-white/80 text-sm mt-1 line-clamp-2">{category.description}</p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Компонент администрирования Telegram бота (только для авторизованных) */}
      {user && (
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Администрирование</h2>
            <TelegramBotAdmin />
          </div>
        </section>
      )}
      
      {/* Call to action */}
      <section className="py-16 bg-travel-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Присоединяйтесь к сообществу путешественников</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Создавайте собственные маршруты, делитесь опытом и открывайте новые места вместе с нами
          </p>
          {!user ? (
            <Button asChild size="lg" className="bg-travel-primary hover:bg-travel-primary/90">
              <a href="#login">Начать путешествие</a>
            </Button>
          ) : (
            <Button asChild size="lg" className="bg-travel-primary hover:bg-travel-primary/90">
              <Link to="/routes/create">Создать маршрут</Link>
            </Button>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
