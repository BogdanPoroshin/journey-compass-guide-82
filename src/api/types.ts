
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  profile_image_url?: string;
  bio?: string;
}

export interface Route {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  duration: number;
  distance: number | null;
  difficulty_level: string | null;
  estimated_cost: number | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface RouteWithDetails extends Route {
  categories: Category[];
  creator: User;
  rating: number;
  review_count: number;
  image_url?: string;
  is_favorited?: boolean;
  points?: PointOfInterest[];
}

export interface PointOfInterest {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  type: string | null;
  contact_info?: string | null;
  website_url?: string | null;
  opening_hours?: string | null;
}

export interface Review {
  id: string;
  route_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  visited_date: string | null;
  created_at: string;
  updated_at: string;
  user: {
    username: string;
    profile_image_url: string | null;
  };
}
