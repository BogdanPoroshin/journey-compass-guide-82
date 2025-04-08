
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapView from "@/components/MapView";
import ReviewSection from "@/components/ReviewSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import { 
  Heart, 
  Share, 
  Clock, 
  MapPin, 
  DollarSign,
  Calendar, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp,
  Star,
  Users,
  Info
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data
const mockRoute = {
  id: 1,
  title: "Pacific Coast Highway Road Trip",
  description: "Experience the stunning beauty of California's coastline on this 3-day journey from San Francisco to Los Angeles. The Pacific Coast Highway (PCH) offers breathtaking ocean views, charming coastal towns, and unforgettable natural wonders. You'll drive through Big Sur's dramatic cliffs, visit the historic Hearst Castle, and enjoy the relaxed beach vibes of Santa Barbara.",
  imageUrls: [
    "https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533293046890-f1f6579521a3?q=80&w=500&auto=format&fit=crop",
  ],
  duration: 3,
  distance: 123,
  difficulty: "Moderate",
  cost: 500,
  rating: 4.8,
  reviewCount: 124,
  categories: [
    { id: 1, name: "Road Trip" },
    { id: 2, name: "Beach" },
    { id: 7, name: "Nature" },
  ],
  creator: {
    id: 101,
    username: "travelguru",
    imageUrl: "https://i.pravatar.cc/150?img=1",
    routesCount: 23,
    joinDate: "2021-05-15",
  },
  createdAt: "2023-02-18",
  updatedAt: "2023-06-22",
  pointsOfInterest: [
    {
      id: 1,
      name: "Golden Gate Bridge",
      description: "Iconic suspension bridge spanning the Golden Gate strait, connecting San Francisco to Marin County.",
      type: "Landmark",
      address: "Golden Gate Bridge, San Francisco, CA",
      latitude: 37.8199,
      longitude: -122.4783,
      stayDuration: 60,
      websiteUrl: "https://www.goldengate.org/",
      contactInfo: "+1 (415) 921-5858",
      openingHours: "24/7",
      notes: "Start your journey by crossing this iconic bridge. Stop at the vista point on the north side for fantastic views of San Francisco."
    },
    {
      id: 2,
      name: "Half Moon Bay",
      description: "Charming coastal city known for its beautiful beaches, surfing, and relaxed atmosphere.",
      type: "Beach",
      address: "Half Moon Bay, CA",
      latitude: 37.4636,
      longitude: -122.4286,
      stayDuration: 120,
      notes: "Great spot for a coffee break and beach walk. Try the local seafood restaurants if you're hungry."
    },
    {
      id: 3,
      name: "Bixby Creek Bridge",
      description: "One of the most photographed bridges in California, offering stunning views of the Pacific coastline.",
      type: "Landmark",
      address: "Bixby Creek Bridge, Big Sur, CA",
      latitude: 36.3714,
      longitude: -121.9022,
      stayDuration: 30,
      notes: "Don't miss this iconic photo spot. Park at the designated areas and be careful when crossing the highway."
    },
    {
      id: 4,
      name: "McWay Falls",
      description: "An 80-foot waterfall that flows year-round directly into the Pacific Ocean.",
      type: "Nature",
      address: "Julia Pfeiffer Burns State Park, Big Sur, CA",
      latitude: 36.1578,
      longitude: -121.6725,
      stayDuration: 60,
      websiteUrl: "https://www.parks.ca.gov/?page_id=578",
      openingHours: "8:00 AM - Sunset",
      notes: "Short 0.5-mile trail to the viewpoint. Note that you cannot access the beach directly."
    },
    {
      id: 5,
      name: "Hearst Castle",
      description: "Opulent estate built by newspaper magnate William Randolph Hearst, featuring a stunning mansion and gardens.",
      type: "Attraction",
      address: "750 Hearst Castle Rd, San Simeon, CA",
      latitude: 35.6852,
      longitude: -121.1682,
      stayDuration: 180,
      websiteUrl: "https://hearstcastle.org/",
      contactInfo: "+1 (800) 444-4445",
      openingHours: "9:00 AM - 5:00 PM",
      notes: "Book tour tickets in advance. The Grand Rooms Tour is recommended for first-time visitors."
    },
    {
      id: 6,
      name: "Santa Barbara",
      description: "Beautiful coastal city known for its Spanish-style architecture, beaches, and wine country.",
      type: "City",
      address: "Santa Barbara, CA",
      latitude: 34.4208,
      longitude: -119.6982,
      stayDuration: 240,
      notes: "Spend the night here. Stroll down State Street for shopping and dining, and visit the historic Mission Santa Barbara."
    }
  ],
  reviews: [
    {
      id: 101,
      rating: 5,
      comment: "This route was absolutely breathtaking! The views along the Pacific Coast Highway are unmatched. We did it over 3 days and felt it was the perfect pace to enjoy all the stops without rushing.",
      visitedDate: "2023-05-20",
      createdAt: "2023-06-01T14:23:00Z",
      user: {
        id: 201,
        username: "adventureseeker",
        profileImage: "https://i.pravatar.cc/150?img=10",
      },
    },
    {
      id: 102,
      rating: 4,
      comment: "Great route overall! The stops were well planned. Only reason for 4 stars is that Hearst Castle was closed when we visited, so check opening times before you go.",
      visitedDate: "2023-04-12",
      createdAt: "2023-04-18T09:45:00Z",
      user: {
        id: 202,
        username: "roadtripper22",
        profileImage: "https://i.pravatar.cc/150?img=11",
      },
    },
    {
      id: 103,
      rating: 5,
      comment: "Perfect itinerary for a long weekend! We added an extra day to spend more time in Santa Barbara which I highly recommend. The coastal views are incredible and this route captures all the highlights.",
      visitedDate: "2023-03-05",
      createdAt: "2023-03-10T16:30:00Z",
      user: {
        id: 203,
        username: "travelwithme",
        profileImage: "https://i.pravatar.cc/150?img=12",
      },
    },
  ]
};

const RouteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<number | undefined>(mockRoute.id);

  // Mock authenticated state
  const isLoggedIn = false;
  const hasUserReviewed = false;

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: !isFavorited ? "Added to favorites" : "Removed from favorites",
      description: !isFavorited 
        ? "This route has been added to your favorites" 
        : "This route has been removed from your favorites",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this route with others",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link to="/routes" className="flex items-center text-travel-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all routes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="relative mb-6">
              <img
                src={mockRoute.imageUrls[currentImageIndex]}
                alt={mockRoute.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
                <div className="flex gap-2 bg-black/50 rounded-full px-3 py-1">
                  {mockRoute.imageUrls.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full ${
                        idx === currentImageIndex ? "bg-white" : "bg-white/40"
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Title and actions */}
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{mockRoute.title}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(mockRoute.rating)
                            ? "fill-travel-accent text-travel-accent"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">
                    {mockRoute.rating.toFixed(1)} ({mockRoute.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 border-travel-primary ${
                    isFavorited ? "bg-travel-primary/10" : ""
                  }`}
                  onClick={handleFavoriteToggle}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? "fill-travel-primary" : ""}`} />
                  <span>{isFavorited ? "Saved" : "Save"}</span>
                </Button>
                <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {mockRoute.categories.map((category) => (
                <Badge key={category.id} variant="outline" className="bg-travel-accent/10">
                  {category.name}
                </Badge>
              ))}
            </div>

            {/* Quick info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-travel-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-travel-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{mockRoute.duration} days</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-travel-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-travel-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-medium">{mockRoute.distance} km</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-travel-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-travel-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Cost</p>
                    <p className="font-medium">${mockRoute.cost}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full bg-travel-primary/10 flex items-center justify-center`}>
                    <Info className="h-5 w-5 text-travel-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <p className="font-medium">{mockRoute.difficulty}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-3">About This Route</h2>
                <div>
                  <p className={showFullDescription ? "" : "line-clamp-3"}>
                    {mockRoute.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="flex items-center mt-2 text-travel-primary p-0 h-auto font-normal hover:bg-transparent hover:text-travel-primary/80"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? (
                      <>
                        Show less <ChevronUp className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Show more <ChevronDown className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Route Map</h2>
              <MapView 
                routes={[{
                  id: mockRoute.id,
                  title: mockRoute.title,
                  points: mockRoute.pointsOfInterest
                }]}
                selectedRouteId={selectedRouteId}
                onRouteSelect={setSelectedRouteId}
              />
            </div>

            {/* Itinerary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Detailed Itinerary</h2>
              <ItineraryTimeline points={mockRoute.pointsOfInterest} />
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <ReviewSection 
                reviews={mockRoute.reviews} 
                averageRating={mockRoute.rating}
                totalReviews={mockRoute.reviewCount}
                isLoggedIn={isLoggedIn}
                hasUserReviewed={hasUserReviewed}
                onAddReview={(rating, comment, visitedDate) => {
                  toast({
                    title: "Review submitted",
                    description: "Thank you for your feedback!",
                  });
                }}
                hasMoreReviews={mockRoute.reviewCount > mockRoute.reviews.length}
                onLoadMore={() => {}}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Creator card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Route Creator</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mockRoute.creator.imageUrl} alt={mockRoute.creator.username} />
                      <AvatarFallback>
                        {mockRoute.creator.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{mockRoute.creator.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {mockRoute.creator.routesCount} routes created
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    Member since {new Date(mockRoute.creator.joinDate).toLocaleDateString()}
                  </div>
                  <Button className="w-full mt-4 bg-travel-primary hover:bg-travel-primary/90" asChild>
                    <Link to={`/user/${mockRoute.creator.id}`}>View Profile</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Similar routes */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Similar Routes</h3>
                  <div className="space-y-4">
                    {[
                      {
                        id: 2,
                        title: "Santa Cruz to Monterey Coastal Drive",
                        duration: 1,
                        imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=300&auto=format&fit=crop",
                      },
                      {
                        id: 3,
                        title: "Highway 1 Big Sur Adventure",
                        duration: 2,
                        imageUrl: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?q=80&w=300&auto=format&fit=crop",
                      },
                      {
                        id: 4,
                        title: "Southern California Beach Tour",
                        duration: 4,
                        imageUrl: "https://images.unsplash.com/photo-1533293046890-f1f6579521a3?q=80&w=300&auto=format&fit=crop",
                      },
                    ].map((route) => (
                      <div key={route.id} className="flex gap-3">
                        <img
                          src={route.imageUrl}
                          alt={route.title}
                          className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                        />
                        <div>
                          <Link
                            to={`/routes/${route.id}`}
                            className="font-medium hover:text-travel-primary hover:underline line-clamp-2"
                          >
                            {route.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {route.duration} day{route.duration !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-travel-primary text-travel-primary"
                    asChild
                  >
                    <Link to={`/categories/${mockRoute.categories[0].name.toLowerCase()}`}>
                      See more {mockRoute.categories[0].name} routes
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Help card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have questions about this route or need travel advice?
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link to="/contact">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RouteDetail;
