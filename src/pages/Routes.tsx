
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import RouteCard from "@/components/RouteCard";
import { Search, Plus } from "lucide-react";
import { getRoutes, getCategories } from "@/api/supabaseApi";
import { RouteWithDetails, Category } from "@/api/types";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";

const RoutesPage = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [routes, setRoutes] = useState<RouteWithDetails[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    categories: [] as number[],
    difficulty: null as string | null,
    duration: [1, 14],
    cost: [0, 5000],
    sort: "popular"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Получаем категории
      const categories = await getCategories();
      setAllCategories(categories);
      
      // Получаем маршруты
      const routes = await getRoutes();
      setRoutes(routes);
      
      setLoading(false);
    };

    fetchData();
  }, []);

  // Фильтрация маршрутов
  const filteredRoutes = routes.filter(route => {
    if (searchQuery && !route.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !route.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.categories.length > 0 && !route.categories.some(cat => filters.categories.includes(cat.id))) {
      return false;
    }
    
    if (filters.difficulty && route.difficulty_level !== filters.difficulty) {
      return false;
    }
    
    if (route.duration < filters.duration[0] || route.duration > filters.duration[1]) {
      return false;
    }
    
    if (route.estimated_cost && (route.estimated_cost < filters.cost[0] || route.estimated_cost > filters.cost[1])) {
      return false;
    }
    
    return true;
  });

  // Сортировка маршрутов
  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    if (filters.sort === "popular") {
      return b.rating - a.rating;
    } else if (filters.sort === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (filters.sort === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return 0;
  });

  const handleFilterChange = (newFilters: any) => {
    setLoading(true);
    setFilters(newFilters);
    
    // Имитируем задержку API
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Имитируем задержку API
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="py-10 bg-travel-primary/5">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Исследуйте маршруты</h1>
              <p className="text-muted-foreground">
                Откройте для себя удивительные путешествия, созданные путешественниками со всего мира
              </p>
            </div>
            
            {user && (
              <Button asChild className="bg-travel-primary hover:bg-travel-primary/90 hidden md:flex">
                <Link to="/routes/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать маршрут
                </Link>
              </Button>
            )}
          </div>

          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Поиск маршрутов по названию или месту..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              <Button type="submit" className="bg-travel-primary hover:bg-travel-primary/90">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar фильтров */}
            <div className="md:w-1/4 lg:w-1/5">
              <FilterBar 
                categories={allCategories}
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            </div>

            {/* Сетка маршрутов */}
            <div className="md:w-3/4 lg:w-4/5">
              {user && (
                <Button asChild className="mb-4 w-full md:hidden bg-travel-primary hover:bg-travel-primary/90">
                  <Link to="/routes/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать маршрут
                  </Link>
                </Button>
              )}
              
              {loading ? (
                <div className="flex justify-center items-center h-60">
                  <div className="text-travel-primary">Загрузка маршрутов...</div>
                </div>
              ) : sortedRoutes.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-lg font-medium mb-2">Маршруты не найдены</h2>
                  <p className="text-muted-foreground mb-4">
                    Попробуйте изменить параметры фильтрации или поисковый запрос
                  </p>
                  <Button onClick={() => handleFilterChange({
                    categories: [],
                    difficulty: null,
                    duration: [1, 14],
                    cost: [0, 5000],
                    sort: "popular"
                  })}>
                    Сбросить фильтры
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedRoutes.map((route) => (
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

              {/* Заглушка пагинации */}
              {sortedRoutes.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline" className="mx-1">Назад</Button>
                  <Button variant="outline" className="mx-1 bg-travel-primary/10">1</Button>
                  <Button variant="outline" className="mx-1">2</Button>
                  <Button variant="outline" className="mx-1">3</Button>
                  <Button variant="outline" className="mx-1">Вперед</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RoutesPage;
