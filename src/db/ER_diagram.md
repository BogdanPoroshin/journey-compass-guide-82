
# Entity-Relationship Diagram for Journey Compass

```
+----------------+       +---------------+       +---------------------+
|     USERS      |       |    ROUTES     |       |  POINTS_OF_INTEREST |
+----------------+       +---------------+       +---------------------+
| PK: id         |       | PK: id        |       | PK: id              |
| username       |       | title         |       | name                |
| email          |       | description   |       | description         |
| password_hash  |       | creator_id    |------>| latitude            |
| full_name      |       | duration      |       | longitude           |
| profile_image  |       | distance      |       | address             |
| bio            |       | difficulty    |       | type                |
| created_at     |       | estimated_cost|       | contact_info        |
| updated_at     |       | is_public     |       | website_url         |
+----------------+       | created_at    |       | opening_hours       |
       |                | updated_at    |       | created_at          |
       |                +---------------+       | updated_at          |
       |                      |                +---------------------+
       |                      |                         |
       |                      |                         |
       v                      v                         |
+----------------+    +----------------+                |
| USER_PREFERENCES|    |  ROUTE_POINTS  |<---------------+
+----------------+    +----------------+
| PK: user_id    |    | PK: id         |
| pref_categories|    | route_id       |
| pref_difficulty|    | point_id       |
| max_distance   |    | sequence_order |
| pref_duration  |    | stay_duration  |
| pref_cost_range|    | notes          |
| updated_at     |    +----------------+
+----------------+
       ^                      ^
       |                      |
       |                      |
+----------------+    +----------------+    +----------------+
|   FAVORITES    |    |    REVIEWS     |    |   CATEGORIES   |
+----------------+    +----------------+    +----------------+
| PK: user_id,   |    | PK: id         |    | PK: id         |
|     route_id   |    | route_id       |    | name           |
| created_at     |    | user_id        |    | description    |
+----------------+    | rating         |    +----------------+
                      | comment        |           |
                      | visited_date   |           |
                      | created_at     |           |
                      | updated_at     |           |
                      +----------------+           |
                                                  |
+----------------+    +----------------+          |
|  ROUTE_IMAGES  |    |  SHARE_LINKS   |    +----------------+
+----------------+    +----------------+    | ROUTE_CATEGORIES|
| PK: id         |    | PK: id         |    +----------------+
| route_id       |    | route_id       |    | route_id       |
| image_url      |    | share_code     |    | category_id    |
| caption        |    | created_by     |    +----------------+
| is_primary     |    | expires_at     |
| sequence_order |    | created_at     |
| created_at     |    +----------------+
+----------------+
```
