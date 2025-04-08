
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteCard from "@/components/RouteCard";
import { ArrowRight, Map, Compass, Star, Bookmark, Users } from "lucide-react";

// Mock data
const popularRoutes = [
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
];

const popularCategories = [
  { id: 1, name: "Beach", icon: "🏖️", count: 243 },
  { id: 2, name: "Mountain", icon: "🏔️", count: 189 },
  { id: 3, name: "City", icon: "🏙️", count: 312 },
  { id: 4, name: "Road Trip", icon: "🚗", count: 156 },
];

const Index = () => {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [travelerCount, setTravelerCount] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient text-white py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Your Journey, Your Way
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Discover and create personalized travel routes based on your interests, preferences, and travel style.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild className="bg-white text-travel-secondary hover:bg-travel-accent hover:text-travel-secondary">
                <Link to="/routes">Explore Routes</Link>
              </Button>
              <Button asChild variant="outline" className="text-white border-white hover:bg-white/20">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="mx-auto -mt-16 relative z-10 shadow-lg max-w-4xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Destination</label>
                  <Input
                    placeholder="Where do you want to go?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="How long?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekend">Weekend (1-3 days)</SelectItem>
                      <SelectItem value="week">Week (4-7 days)</SelectItem>
                      <SelectItem value="twoweeks">Two Weeks (8-14 days)</SelectItem>
                      <SelectItem value="longer">Longer Trip (14+ days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Travelers</label>
                  <Select value={travelerCount} onValueChange={setTravelerCount}>
                    <SelectTrigger>
                      <SelectValue placeholder="How many?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 person</SelectItem>
                      <SelectItem value="2">2 people</SelectItem>
                      <SelectItem value="3-5">3-5 people</SelectItem>
                      <SelectItem value="6+">6+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <Button className="w-full md:w-auto bg-travel-primary hover:bg-travel-primary/90">
                  Search Routes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Popular Routes</h2>
            <Button asChild variant="outline" className="hidden md:flex items-center gap-1 border-travel-primary text-travel-primary hover:bg-travel-primary/10">
              <Link to="/routes">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route) => (
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
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center md:hidden">
            <Button asChild variant="outline" className="flex items-center gap-1 border-travel-primary text-travel-primary">
              <Link to="/routes">
                View All Routes <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Browse by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.name.toLowerCase()}`}
                className="group bg-white rounded-lg shadow hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold mb-1 group-hover:text-travel-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.count} routes</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-travel-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Why Choose JourneyCompass</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our platform offers everything you need to discover, plan, and share your perfect travel experiences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-travel-primary/10 text-travel-primary mb-4">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
              <p className="text-muted-foreground">
                Get route suggestions tailored to your preferences, interests, and travel style.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-travel-primary/10 text-travel-primary mb-4">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Maps</h3>
              <p className="text-muted-foreground">
                Explore routes visually with interactive maps showing all points of interest.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-travel-primary/10 text-travel-primary mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Reviews</h3>
              <p className="text-muted-foreground">
                Read authentic reviews from travelers who have experienced the routes firsthand.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <Button asChild className="bg-travel-primary hover:bg-travel-primary/90">
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-travel-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="mb-8 max-w-xl mx-auto text-white/90">
            Create an account to save your favorite routes, get personalized recommendations, and start planning your next adventure.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild className="bg-white text-travel-secondary hover:bg-travel-accent hover:text-travel-secondary">
              <Link to="/signup">Sign Up Now</Link>
            </Button>
            <Button asChild variant="outline" className="text-white border-white hover:bg-white/20">
              <Link to="/routes">Explore Routes</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
