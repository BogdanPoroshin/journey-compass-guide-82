
-- Database Schema for Travel Routes Recommendation Platform

CREATE DATABASE journey_compass;

\c journey_compass;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    profile_image_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Travel routes table
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL, -- In days
    distance FLOAT, -- In kilometers
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('Easy', 'Moderate', 'Hard', 'Extreme')),
    estimated_cost DECIMAL(10, 2),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Category for routes
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Route categories (many-to-many)
CREATE TABLE route_categories (
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (route_id, category_id)
);

-- Points of interest table
CREATE TABLE points_of_interest (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    type VARCHAR(50), -- e.g., restaurant, landmark, hotel
    contact_info TEXT,
    website_url TEXT,
    opening_hours TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Route points (connecting routes with points of interest in sequence)
CREATE TABLE route_points (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    point_id INTEGER REFERENCES points_of_interest(id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL, -- Order in the route
    stay_duration INTEGER, -- In minutes
    notes TEXT,
    UNIQUE (route_id, point_id, sequence_order)
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT,
    visited_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (route_id, user_id) -- One review per user per route
);

-- Favorites table (for users to save routes)
CREATE TABLE favorites (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, route_id)
);

-- Route images
CREATE TABLE route_images (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT false,
    sequence_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User preferences for route recommendations
CREATE TABLE user_preferences (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
    preferred_categories INTEGER[] DEFAULT '{}', -- Array of category IDs
    preferred_difficulty VARCHAR(20)[] DEFAULT '{}', -- Array of difficulty levels
    max_distance FLOAT, -- Maximum distance in km
    preferred_duration_min INTEGER, -- Minimum duration in days
    preferred_duration_max INTEGER, -- Maximum duration in days
    preferred_cost_min DECIMAL(10, 2),
    preferred_cost_max DECIMAL(10, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Route sharing links
CREATE TABLE share_links (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    share_code VARCHAR(50) UNIQUE NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_routes_creator ON routes(creator_id);
CREATE INDEX idx_route_points_route_id ON route_points(route_id);
CREATE INDEX idx_reviews_route_id ON reviews(route_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_route_images_route_id ON route_images(route_id);

-- Insert some example categories
INSERT INTO categories (name, description) VALUES 
('Beach', 'Coastal routes with sandy shores and ocean views'),
('Mountain', 'Hiking and trekking routes through mountain ranges'),
('City', 'Urban exploration routes through metropolitan areas'),
('Cultural', 'Routes highlighting historical and cultural landmarks'),
('Adventure', 'Adrenaline-pumping routes for thrill-seekers'),
('Nature', 'Routes through forests, parks, and natural wonders'),
('Food & Wine', 'Culinary exploration routes featuring local cuisine and wineries'),
('Road Trip', 'Routes designed for automobile travel on scenic roads');

-- Add trigger functions for updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables with updated_at column
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_routes_timestamp
BEFORE UPDATE ON routes
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_points_of_interest_timestamp
BEFORE UPDATE ON points_of_interest
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reviews_timestamp
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_preferences_timestamp
BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
