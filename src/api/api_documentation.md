
# API Documentation for Journey Compass

## Base URL
```
https://api.journeycompass.com/v1
```

## Authentication

Most endpoints require authentication via JWT token.

**Authentication Header:**
```
Authorization: Bearer <token>
```

### Auth Endpoints

#### Register a new user

| Route | Method | Description | Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/auth/register` | POST | Creates a new user account | `username`, `email`, `password`, `full_name` (optional) | Content-Type: application/json | 201: Created, 400: Bad Request, 409: Conflict (Username/Email exists) |

#### Login

| Route | Method | Description | Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/auth/login` | POST | Authenticates a user and returns JWT token | `email`, `password` | Content-Type: application/json | 200: Success, 401: Unauthorized |

#### Logout

| Route | Method | Description | Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/auth/logout` | POST | Invalidates the current JWT token | None | Authorization: Bearer \<token\> | 200: Success, 401: Unauthorized |

#### Get Current User

| Route | Method | Description | Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/auth/me` | GET | Returns the current authenticated user details | None | Authorization: Bearer \<token\> | 200: Success, 401: Unauthorized |

### Routes Endpoints

#### Get All Routes

| Route | Method | Description | Query Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes` | GET | Returns a list of all public routes | `page`, `limit`, `sort`, `category`, `difficulty`, `min_duration`, `max_duration`, `min_cost`, `max_cost` | Optional: Authorization: Bearer \<token\> | 200: Success |

#### Get Route By ID

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:id` | GET | Returns details of a specific route | `id` | Optional: Authorization: Bearer \<token\> | 200: Success, 404: Not Found |

#### Create New Route

| Route | Method | Description | Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes` | POST | Creates a new route | `title`, `description`, `duration`, `distance`, `difficulty_level`, `estimated_cost`, `is_public`, `categories` | Authorization: Bearer \<token\>, Content-Type: application/json | 201: Created, 400: Bad Request, 401: Unauthorized |

#### Update Route

| Route | Method | Description | Path Parameters, Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:id` | PUT | Updates a route | `id`, `title`, `description`, `duration`, `distance`, `difficulty_level`, `estimated_cost`, `is_public`, `categories` | Authorization: Bearer \<token\>, Content-Type: application/json | 200: Success, 400: Bad Request, 401: Unauthorized, 404: Not Found |

#### Delete Route

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:id` | DELETE | Deletes a route | `id` | Authorization: Bearer \<token\> | 204: No Content, 401: Unauthorized, 404: Not Found |

#### Get Recommended Routes

| Route | Method | Description | Query Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/recommended` | GET | Returns personalized route recommendations | `limit` | Authorization: Bearer \<token\> | 200: Success, 401: Unauthorized |

### Points of Interest Endpoints

#### Get All POIs

| Route | Method | Description | Query Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/pois` | GET | Returns a list of points of interest | `page`, `limit`, `type` | Content-Type: application/json | 200: Success |

#### Get POI By ID

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/pois/:id` | GET | Returns details of a specific POI | `id` | Content-Type: application/json | 200: Success, 404: Not Found |

#### Create New POI

| Route | Method | Description | Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/pois` | POST | Creates a new point of interest | `name`, `description`, `latitude`, `longitude`, `address`, `type`, `contact_info`, `website_url`, `opening_hours` | Authorization: Bearer \<token\>, Content-Type: application/json | 201: Created, 400: Bad Request, 401: Unauthorized |

#### Update POI

| Route | Method | Description | Path Parameters, Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/pois/:id` | PUT | Updates a point of interest | `id`, `name`, `description`, `latitude`, `longitude`, `address`, `type`, `contact_info`, `website_url`, `opening_hours` | Authorization: Bearer \<token\>, Content-Type: application/json | 200: Success, 400: Bad Request, 401: Unauthorized, 404: Not Found |

#### Delete POI

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/pois/:id` | DELETE | Deletes a point of interest | `id` | Authorization: Bearer \<token\> | 204: No Content, 401: Unauthorized, 404: Not Found |

### Route Points Endpoints

#### Get Route Points

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:id/points` | GET | Returns all points in a route | `id` | Content-Type: application/json | 200: Success, 404: Not Found |

#### Add Point to Route

| Route | Method | Description | Path Parameters, Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:id/points` | POST | Adds a point to a route | `id`, `point_id`, `sequence_order`, `stay_duration`, `notes` | Authorization: Bearer \<token\>, Content-Type: application/json | 201: Created, 400: Bad Request, 401: Unauthorized, 404: Not Found |

#### Update Route Point

| Route | Method | Description | Path Parameters, Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:routeId/points/:pointId` | PUT | Updates a point in a route | `routeId`, `pointId`, `sequence_order`, `stay_duration`, `notes` | Authorization: Bearer \<token\>, Content-Type: application/json | 200: Success, 400: Bad Request, 401: Unauthorized, 404: Not Found |

#### Remove Point from Route

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:routeId/points/:pointId` | DELETE | Removes a point from a route | `routeId`, `pointId` | Authorization: Bearer \<token\> | 204: No Content, 401: Unauthorized, 404: Not Found |

### Reviews Endpoints

#### Get Reviews for Route

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:id/reviews` | GET | Returns all reviews for a route | `id` | Content-Type: application/json | 200: Success, 404: Not Found |

#### Add Review to Route

| Route | Method | Description | Path Parameters, Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:id/reviews` | POST | Adds a review to a route | `id`, `rating`, `comment`, `visited_date` | Authorization: Bearer \<token\>, Content-Type: application/json | 201: Created, 400: Bad Request, 401: Unauthorized, 404: Not Found |

#### Update Review

| Route | Method | Description | Path Parameters, Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:routeId/reviews/:reviewId` | PUT | Updates a review | `routeId`, `reviewId`, `rating`, `comment`, `visited_date` | Authorization: Bearer \<token\>, Content-Type: application/json | 200: Success, 400: Bad Request, 401: Unauthorized, 404: Not Found |

#### Delete Review

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:routeId/reviews/:reviewId` | DELETE | Deletes a review | `routeId`, `reviewId` | Authorization: Bearer \<token\> | 204: No Content, 401: Unauthorized, 404: Not Found |

### Favorites Endpoints

#### Get User's Favorite Routes

| Route | Method | Description | Query Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/favorites` | GET | Returns all routes favorited by the user | `page`, `limit` | Authorization: Bearer \<token\> | 200: Success, 401: Unauthorized |

#### Add Route to Favorites

| Route | Method | Description | Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/favorites` | POST | Adds a route to user's favorites | `route_id` | Authorization: Bearer \<token\>, Content-Type: application/json | 201: Created, 400: Bad Request, 401: Unauthorized, 404: Not Found |

#### Remove Route from Favorites

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/favorites/:routeId` | DELETE | Removes a route from user's favorites | `routeId` | Authorization: Bearer \<token\> | 204: No Content, 401: Unauthorized, 404: Not Found |

### Sharing Endpoints

#### Create Sharing Link

| Route | Method | Description | Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/routes/:id/share` | POST | Creates a sharing link for a route | `id`, `expires_at` (optional) | Authorization: Bearer \<token\>, Content-Type: application/json | 201: Created, 400: Bad Request, 401: Unauthorized, 404: Not Found |

#### Get Route by Sharing Link

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/share/:code` | GET | Returns a route using a sharing code | `code` | Content-Type: application/json | 200: Success, 404: Not Found |

### User Preference Endpoints

#### Get User Preferences

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/preferences` | GET | Returns the current user's preferences | None | Authorization: Bearer \<token\> | 200: Success, 401: Unauthorized, 404: Not Found |

#### Update User Preferences

| Route | Method | Description | Body Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/preferences` | PUT | Updates the current user's preferences | `preferred_categories`, `preferred_difficulty`, `max_distance`, `preferred_duration_min`, `preferred_duration_max`, `preferred_cost_min`, `preferred_cost_max` | Authorization: Bearer \<token\>, Content-Type: application/json | 200: Success, 400: Bad Request, 401: Unauthorized |

### Categories Endpoints

#### Get All Categories

| Route | Method | Description | Query Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/categories` | GET | Returns a list of all categories | None | Content-Type: application/json | 200: Success |

#### Get Category By ID

| Route | Method | Description | Path Parameters | Headers | Response Codes |
|-------|--------|-------------|-----------------|---------|----------------|
| `/categories/:id` | GET | Returns details of a specific category | `id` | Content-Type: application/json | 200: Success, 404: Not Found |

## Response Formats

### Success Response Format
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description of the error"
  }
}
```

## API Rate Limiting

- 100 requests per minute for authenticated users
- 30 requests per minute for unauthenticated users

## Data Models

### User Model
```json
{
  "id": 1,
  "username": "traveler123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "profile_image_url": "https://example.com/profile.jpg",
  "bio": "Avid traveler and photographer",
  "created_at": "2023-01-15T08:30:00Z",
  "updated_at": "2023-01-15T08:30:00Z"
}
```

### Route Model
```json
{
  "id": 1,
  "title": "Pacific Coast Highway Road Trip",
  "description": "Scenic drive along California's coast",
  "creator": {
    "id": 1,
    "username": "traveler123"
  },
  "duration": 3,
  "distance": 123.5,
  "difficulty_level": "Moderate",
  "estimated_cost": 500.00,
  "is_public": true,
  "categories": [
    {"id": 8, "name": "Road Trip"},
    {"id": 1, "name": "Beach"}
  ],
  "average_rating": 4.7,
  "review_count": 15,
  "created_at": "2023-02-10T14:20:00Z",
  "updated_at": "2023-02-15T09:45:00Z"
}
```

### Point of Interest Model
```json
{
  "id": 1,
  "name": "Golden Gate Bridge",
  "description": "Iconic suspension bridge in San Francisco",
  "latitude": 37.8199,
  "longitude": -122.4783,
  "address": "Golden Gate Bridge, San Francisco, CA",
  "type": "landmark",
  "contact_info": "+1 (415) 921-5858",
  "website_url": "https://www.goldengate.org/",
  "opening_hours": "24/7",
  "created_at": "2023-01-05T10:00:00Z",
  "updated_at": "2023-01-05T10:00:00Z"
}
```

### Review Model
```json
{
  "id": 1,
  "route_id": 1,
  "user": {
    "id": 2,
    "username": "explorer99"
  },
  "rating": 5,
  "comment": "Breathtaking views and well-planned stops!",
  "visited_date": "2023-03-15",
  "created_at": "2023-03-20T16:45:00Z",
  "updated_at": "2023-03-20T16:45:00Z"
}
```
