
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import RouteCard from "@/components/RouteCard";
import { Search } from "lucide-react";

// Mock data
const mockRoutes = [
  {
    id: 1,
    title: "Pacific Coast Highway",
    description: "A scenic drive along California's stunning coastline featuring beaches, cliffs and quaint towns.",
    imageUrl: "https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=500&auto=format&fit=crop",
    duration: 3,
    distance: 123,
    difficulty: "Moderate",
    cost: 500,
    rating: 4.8,
    reviewCount: 124,
    categories: [
      { id: 1, name: "Road Trip" },
      { id: 2, name: "Beach" },
    ],
    creator: {
      id: 101,
      username: "travelguru",
      imageUrl: "https://i.pravatar.cc/150?img=1",
    },
  },
  {
    id: 2,
    title: "Japan's Golden Route",
    description: "Explore the best of Japan from Tokyo to Kyoto, experiencing traditional culture and modern attractions.",
    imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=500&auto=format&fit=crop",
    duration: 7,
    distance: 450,
    difficulty: "Easy",
    cost: 1200,
    rating: 4.9,
    reviewCount: 87,
    categories: [
      { id: 3, name: "Cultural" },
      { id: 4, name: "City" },
    ],
    creator: {
      id: 102,
      username: "wanderlust",
      imageUrl: "https://i.pravatar.cc/150?img=2",
    },
  },
  {
    id: 3,
    title: "Alpine Adventure",
    description: "Trek through Switzerland's breathtaking mountain landscapes and charming villages.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=500&auto=format&fit=crop",
    duration: 5,
    distance: 75,
    difficulty: "Hard",
    cost: 900,
    rating: 4.7,
    reviewCount: 53,
    categories: [
      { id: 5, name: "Mountain" },
      { id: 6, name: "Adventure" },
    ],
    creator: {
      id: 103,
      username: "alpinist",
      imageUrl: "https://i.pravatar.cc/150?img=3",
    },
  },
  {
    id: 4,
    title: "Tropical Paradise Tour",
    description: "Island hopping through Thailand's most beautiful beaches and hidden coves.",
    imageUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?q=80&w=500&auto=format&fit=crop",
    duration: 10,
    distance: 200,
    difficulty: "Easy",
    cost: 1500,
    rating: 4.6,
    reviewCount: 98,
    categories: [
      { id: 2, name: "Beach" },
      { id: 7, name: "Nature" },
    ],
    creator: {
      id: 104,
      username: "islandhopper",
      imageUrl: "https://i.pravatar.cc/150?img=4",
    },
  },
  {
    id: 5,
    title: "Tuscany Wine Trail",
    description: "A gastronomic journey through Italy's wine country with stops at historic vineyards and medieval towns.",
    imageUrl: "https://images.unsplash.com/photo-1543218024-57a70143c369?q=80&w=500&auto=format&fit=crop",
    duration: 4,
    distance: 150,
    difficulty: "Easy",
    cost: 1100,
    rating: 4.9,
    reviewCount: 76,
    categories: [
      { id: 8, name: "Food & Wine" },
      { id: 9, name: "Cultural" },
    ],
    creator: {
      id: 105,
      username: "winelover",
      imageUrl: "https://i.pravatar.cc/150?img=5",
    },
  },
  {
    id: 6,
    title: "Inca Trail to Machu Picchu",
    description: "Follow ancient paths through the Andes to reach the iconic lost city of the Incas.",
    imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=500&auto=format&fit=crop",
    duration: 4,
    distance: 43,
    difficulty: "Hard",
    cost: 800,
    rating: 4.8,
    reviewCount: 142,
    categories: [
      { id: 5, name: "Mountain" },
      { id: 6, name: "Adventure" },
      { id: 9, name: "Cultural" },
    ],
    creator: {
      id: 106,
      username: "hikingpro",
      imageUrl: "https://i.pravatar.cc/150?img=6",
    },
  }
];

const categories = [
  { id: 1, name: "Road Trip" },
  { id: 2, name: "Beach" },
  { id: 3, name: "Cultural" },
  { id: 4, name: "City" },
  { id: 5, name: "Mountain" },
  { id: 6, name: "Adventure" },
  { id: 7, name: "Nature" },
  { id: 8, name: "Food & Wine" },
];

const Routes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    categories: [],
    difficulty: null,
    duration: [1, 14],
    cost: [0, 5000],
    sort: "popular"
  });
  const [loading, setLoading] = useState(false);

  // Mock filter functionality
  const filteredRoutes = mockRoutes.filter(route => {
    if (searchQuery && !route.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.categories.length > 0 && !route.categories.some(cat => filters.categories.includes(cat.id))) {
      return false;
    }
    
    if (filters.difficulty && route.difficulty !== filters.difficulty) {
      return false;
    }
    
    if (route.duration < filters.duration[0] || route.duration > filters.duration[1]) {
      return false;
    }
    
    if (route.cost < filters.cost[0] || route.cost > filters.cost[1]) {
      return false;
    }
    
    return true;
  });

  // Mock API call for filtering/searching
  const handleFilterChange = (newFilters: any) => {
    setLoading(true);
    setFilters(newFilters);
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const toggleFavorite = (routeId: number) => {
    if (favorites.includes(routeId)) {
      setFavorites(favorites.filter(id => id !== routeId));
    } else {
      setFavorites([...favorites, routeId]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="py-10 bg-travel-primary/5">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Explore Travel Routes</h1>
            <p className="text-muted-foreground">
              Discover amazing journeys crafted by travelers all around the world
            </p>
          </div>

          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search routes by name or location..."
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
            {/* Filter sidebar */}
            <div className="md:w-1/4 lg:w-1/5">
              <FilterBar categories={categories} onFilterChange={handleFilterChange} />
            </div>

            {/* Routes grid */}
            <div className="md:w-3/4 lg:w-4/5">
              {loading ? (
                <div className="flex justify-center items-center h-60">
                  <div className="text-travel-primary">Loading routes...</div>
                </div>
              ) : filteredRoutes.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-lg font-medium mb-2">No routes found</h2>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={handleFilterChange.bind(null, {
                    categories: [],
                    difficulty: null,
                    duration: [1, 14],
                    cost: [0, 5000],
                    sort: "popular"
                  })}>
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRoutes.map((route) => (
                    <RouteCard
                      key={route.id}
                      id={route.id}
                      title={route.title}
                      description={route.description}
                      imageUrl={route.imageUrl}
                      duration={route.duration}
                      distance={route.distance}
                      difficulty={route.difficulty}
                      cost={route.cost}
                      rating={route.rating}
                      reviewCount={route.reviewCount}
                      categories={route.categories}
                      creator={route.creator}
                      isFavorited={favorites.includes(route.id)}
                      onFavoriteToggle={toggleFavorite}
                    />
                  ))}
                </div>
              )}

              {/* Pagination placeholder */}
              <div className="flex justify-center mt-8">
                <Button variant="outline" className="mx-1">Prev</Button>
                <Button variant="outline" className="mx-1 bg-travel-primary/10">1</Button>
                <Button variant="outline" className="mx-1">2</Button>
                <Button variant="outline" className="mx-1">3</Button>
                <Button variant="outline" className="mx-1">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Routes;
