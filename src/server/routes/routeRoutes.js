
const express = require('express');
const router = express.Router();

// Authentication middleware (imported from authRoutes)
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    const result = await req.db.query('SELECT id, username, email FROM users WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    req.user = result.rows[0];
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
};

// Optional authentication - doesn't require auth but uses it if present
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    const result = await req.db.query('SELECT id, username, email FROM users WHERE id = $1', [decoded.userId]);
    
    req.user = result.rows.length ? result.rows[0] : null;
    next();
    
  } catch (error) {
    req.user = null;
    next();
  }
};

// Get all routes with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'created_at:desc',
      category,
      difficulty,
      min_duration,
      max_duration,
      min_cost,
      max_cost,
      search
    } = req.query;
    
    const offset = (page - 1) * limit;
    const [sortField, sortOrder] = sort.split(':');
    
    // Build query conditions
    let conditions = ['is_public = true'];
    let params = [];
    let paramIndex = 1;
    
    // Add category filter
    if (category) {
      conditions.push(`EXISTS (
        SELECT 1 FROM route_categories rc 
        WHERE rc.route_id = routes.id AND rc.category_id = $${paramIndex}
      )`);
      params.push(category);
      paramIndex++;
    }
    
    // Add difficulty filter
    if (difficulty) {
      conditions.push(`difficulty_level = $${paramIndex}`);
      params.push(difficulty);
      paramIndex++;
    }
    
    // Add duration filters
    if (min_duration) {
      conditions.push(`duration >= $${paramIndex}`);
      params.push(min_duration);
      paramIndex++;
    }
    
    if (max_duration) {
      conditions.push(`duration <= $${paramIndex}`);
      params.push(max_duration);
      paramIndex++;
    }
    
    // Add cost filters
    if (min_cost) {
      conditions.push(`estimated_cost >= $${paramIndex}`);
      params.push(min_cost);
      paramIndex++;
    }
    
    if (max_cost) {
      conditions.push(`estimated_cost <= $${paramIndex}`);
      params.push(max_cost);
      paramIndex++;
    }
    
    // Add text search
    if (search) {
      conditions.push(`(
        title ILIKE $${paramIndex} OR 
        description ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // If user is logged in, include their private routes
    if (req.user) {
      conditions = [
        `(${conditions.join(' AND ')}) OR creator_id = $${paramIndex}`
      ];
      params.push(req.user.id);
      paramIndex++;
    }
    
    // Build the WHERE clause
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Query for routes with pagination
    const routesQuery = `
      SELECT 
        r.id, r.title, r.description, r.duration, r.distance, 
        r.difficulty_level, r.estimated_cost, r.is_public, 
        r.created_at, r.updated_at,
        u.id as creator_id, u.username as creator_username,
        COALESCE(AVG(rev.rating), 0) as average_rating,
        COUNT(DISTINCT rev.id) as review_count,
        EXISTS(
          SELECT 1 FROM favorites f 
          WHERE f.route_id = r.id AND f.user_id = $${paramIndex}
        ) as is_favorited,
        (
          SELECT json_agg(json_build_object('id', c.id, 'name', c.name))
          FROM categories c
          JOIN route_categories rc ON c.id = rc.category_id
          WHERE rc.route_id = r.id
        ) as categories,
        (
          SELECT image_url FROM route_images ri 
          WHERE ri.route_id = r.id AND ri.is_primary = true
          LIMIT 1
        ) as primary_image_url
      FROM routes r
      JOIN users u ON r.creator_id = u.id
      LEFT JOIN reviews rev ON r.id = rev.route_id
      ${whereClause}
      GROUP BY r.id, u.id
      ORDER BY ${sortField} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}
      LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}
    `;
    
    // Add parameters for user's favorites check and pagination
    params.push(req.user ? req.user.id : null);
    params.push(limit);
    params.push(offset);
    
    // Execute query
    const routesResult = await req.db.query(routesQuery, params);
    
    // Count total routes for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT r.id) as total
      FROM routes r
      ${whereClause}
    `;
    
    // Remove pagination params for count query
    const countParams = params.slice(0, -2);
    const countResult = await req.db.query(countQuery, countParams);
    
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: {
        routes: routesResult.rows,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      },
      message: 'Routes retrieved successfully'
    });
    
  } catch (err) {
    console.error('Get routes error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to retrieve routes'
      }
    });
  }
});

// Get route by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Query for detailed route information
    const routeQuery = `
      SELECT 
        r.id, r.title, r.description, r.duration, r.distance, 
        r.difficulty_level, r.estimated_cost, r.is_public, 
        r.created_at, r.updated_at,
        u.id as creator_id, u.username as creator_username,
        u.profile_image_url as creator_image,
        COALESCE(AVG(rev.rating), 0) as average_rating,
        COUNT(DISTINCT rev.id) as review_count,
        EXISTS(
          SELECT 1 FROM favorites f 
          WHERE f.route_id = r.id AND f.user_id = $2
        ) as is_favorited,
        (
          SELECT json_agg(json_build_object(
            'id', c.id, 
            'name', c.name,
            'description', c.description
          ))
          FROM categories c
          JOIN route_categories rc ON c.id = rc.category_id
          WHERE rc.route_id = r.id
        ) as categories,
        (
          SELECT json_agg(json_build_object(
            'id', ri.id, 
            'image_url', ri.image_url,
            'caption', ri.caption,
            'is_primary', ri.is_primary
          ) ORDER BY ri.sequence_order)
          FROM route_images ri
          WHERE ri.route_id = r.id
        ) as images
      FROM routes r
      JOIN users u ON r.creator_id = u.id
      LEFT JOIN reviews rev ON r.id = rev.route_id
      WHERE r.id = $1
        AND (r.is_public = true OR r.creator_id = $2 OR $3 = true)
      GROUP BY r.id, u.id
    `;
    
    const routeResult = await req.db.query(
      routeQuery, 
      [id, req.user ? req.user.id : null, req.user ? req.user.id === parseInt(id) : false]
    );
    
    if (routeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ROUTE_NOT_FOUND',
          message: 'Route not found'
        }
      });
    }
    
    // Get points of interest for this route
    const pointsQuery = `
      SELECT 
        rp.id as route_point_id,
        rp.sequence_order, rp.stay_duration, rp.notes,
        poi.id, poi.name, poi.description, poi.latitude, poi.longitude,
        poi.address, poi.type, poi.website_url, poi.opening_hours
      FROM route_points rp
      JOIN points_of_interest poi ON rp.point_id = poi.id
      WHERE rp.route_id = $1
      ORDER BY rp.sequence_order
    `;
    
    const pointsResult = await req.db.query(pointsQuery, [id]);
    
    // Combine all data
    const routeData = {
      ...routeResult.rows[0],
      points: pointsResult.rows
    };
    
    res.status(200).json({
      success: true,
      data: routeData,
      message: 'Route retrieved successfully'
    });
    
  } catch (err) {
    console.error('Get route error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to retrieve route'
      }
    });
  }
});

// Create new route
router.post('/', authenticate, async (req, res) => {
  const client = await req.db.connect();
  
  try {
    const {
      title,
      description,
      duration,
      distance,
      difficulty_level,
      estimated_cost,
      is_public = true,
      categories = [],
      points = []
    } = req.body;
    
    // Validate input
    if (!title || !description || !duration) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Title, description and duration are required'
        }
      });
    }
    
    // Validate difficulty level
    const validDifficulties = ['Easy', 'Moderate', 'Hard', 'Extreme'];
    if (difficulty_level && !validDifficulties.includes(difficulty_level)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DIFFICULTY',
          message: 'Invalid difficulty level'
        }
      });
    }
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Insert route
    const routeResult = await client.query(
      `INSERT INTO routes 
        (title, description, creator_id, duration, distance, difficulty_level, estimated_cost, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [title, description, req.user.id, duration, distance, difficulty_level, estimated_cost, is_public]
    );
    
    const routeId = routeResult.rows[0].id;
    
    // Add categories if provided
    if (categories.length > 0) {
      const categoryValues = categories.map((categoryId, index) => 
        `($1, $${index + 2})`
      ).join(', ');
      
      await client.query(
        `INSERT INTO route_categories (route_id, category_id)
         VALUES ${categoryValues}`,
        [routeId, ...categories]
      );
    }
    
    // Add points of interest if provided
    if (points.length > 0) {
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        
        // Check if point exists or needs to be created
        let pointId;
        
        if (point.id) {
          // Use existing point
          pointId = point.id;
        } else {
          // Create new point
          const pointResult = await client.query(
            `INSERT INTO points_of_interest 
              (name, description, latitude, longitude, address, type, website_url, opening_hours)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id`,
            [
              point.name, 
              point.description, 
              point.latitude, 
              point.longitude, 
              point.address,
              point.type,
              point.website_url,
              point.opening_hours
            ]
          );
          
          pointId = pointResult.rows[0].id;
        }
        
        // Add to route points
        await client.query(
          `INSERT INTO route_points 
            (route_id, point_id, sequence_order, stay_duration, notes)
           VALUES ($1, $2, $3, $4, $5)`,
          [routeId, pointId, i + 1, point.stay_duration, point.notes]
        );
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      data: { id: routeId },
      message: 'Route created successfully'
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create route error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to create route'
      }
    });
  } finally {
    client.release();
  }
});

// Update route
router.put('/:id', authenticate, async (req, res) => {
  const client = await req.db.connect();
  
  try {
    const { id } = req.params;
    const {
      title,
      description,
      duration,
      distance,
      difficulty_level,
      estimated_cost,
      is_public,
      categories = []
    } = req.body;
    
    // Check if route exists and user owns it
    const routeCheck = await client.query(
      'SELECT creator_id FROM routes WHERE id = $1',
      [id]
    );
    
    if (routeCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ROUTE_NOT_FOUND',
          message: 'Route not found'
        }
      });
    }
    
    if (routeCheck.rows[0].creator_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this route'
        }
      });
    }
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Update route
    await client.query(
      `UPDATE routes 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           duration = COALESCE($3, duration),
           distance = COALESCE($4, distance),
           difficulty_level = COALESCE($5, difficulty_level),
           estimated_cost = COALESCE($6, estimated_cost),
           is_public = COALESCE($7, is_public),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8`,
      [title, description, duration, distance, difficulty_level, estimated_cost, is_public, id]
    );
    
    // Update categories if provided
    if (categories.length > 0) {
      // Remove existing categories
      await client.query(
        'DELETE FROM route_categories WHERE route_id = $1',
        [id]
      );
      
      // Add new categories
      const categoryValues = categories.map((categoryId, index) => 
        `($1, $${index + 2})`
      ).join(', ');
      
      await client.query(
        `INSERT INTO route_categories (route_id, category_id)
         VALUES ${categoryValues}`,
        [id, ...categories]
      );
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.status(200).json({
      success: true,
      message: 'Route updated successfully'
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update route error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update route'
      }
    });
  } finally {
    client.release();
  }
});

// Delete route
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if route exists and user owns it
    const routeCheck = await req.db.query(
      'SELECT creator_id FROM routes WHERE id = $1',
      [id]
    );
    
    if (routeCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ROUTE_NOT_FOUND',
          message: 'Route not found'
        }
      });
    }
    
    if (routeCheck.rows[0].creator_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this route'
        }
      });
    }
    
    // Delete route (cascades to route_points, route_categories, reviews, favorites, route_images)
    await req.db.query('DELETE FROM routes WHERE id = $1', [id]);
    
    res.status(204).send();
    
  } catch (err) {
    console.error('Delete route error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete route'
      }
    });
  }
});

// Get recommended routes
router.get('/recommended', authenticate, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get user preferences
    const preferencesResult = await req.db.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [req.user.id]
    );
    
    // Build recommendation query based on user preferences
    let recommendationQuery = `
      SELECT 
        r.id, r.title, r.description, r.duration, r.distance, 
        r.difficulty_level, r.estimated_cost, r.created_at,
        u.id as creator_id, u.username as creator_username,
        COALESCE(AVG(rev.rating), 0) as average_rating,
        COUNT(DISTINCT rev.id) as review_count,
        (
          SELECT json_agg(json_build_object('id', c.id, 'name', c.name))
          FROM categories c
          JOIN route_categories rc ON c.id = rc.category_id
          WHERE rc.route_id = r.id
        ) as categories,
        (
          SELECT image_url FROM route_images ri 
          WHERE ri.route_id = r.id AND ri.is_primary = true
          LIMIT 1
        ) as primary_image_url
      FROM routes r
      JOIN users u ON r.creator_id = u.id
      LEFT JOIN reviews rev ON r.id = rev.route_id
      LEFT JOIN route_categories rc ON r.id = rc.route_id
    `;
    
    let conditions = ['r.is_public = true', 'r.creator_id != $1'];
    let params = [req.user.id];
    let paramIndex = 2;
    
    // If user has preferences, use them for recommendations
    if (preferencesResult.rows.length > 0) {
      const prefs = preferencesResult.rows[0];
      
      // Filter by preferred categories if specified
      if (prefs.preferred_categories && prefs.preferred_categories.length > 0) {
        conditions.push(`rc.category_id = ANY($${paramIndex}::integer[])`);
        params.push(prefs.preferred_categories);
        paramIndex++;
      }
      
      // Filter by preferred difficulty if specified
      if (prefs.preferred_difficulty && prefs.preferred_difficulty.length > 0) {
        conditions.push(`r.difficulty_level = ANY($${paramIndex}::varchar[])`);
        params.push(prefs.preferred_difficulty);
        paramIndex++;
      }
      
      // Filter by maximum distance if specified
      if (prefs.max_distance) {
        conditions.push(`r.distance <= $${paramIndex}`);
        params.push(prefs.max_distance);
        paramIndex++;
      }
      
      // Filter by duration range if specified
      if (prefs.preferred_duration_min) {
        conditions.push(`r.duration >= $${paramIndex}`);
        params.push(prefs.preferred_duration_min);
        paramIndex++;
      }
      
      if (prefs.preferred_duration_max) {
        conditions.push(`r.duration <= $${paramIndex}`);
        params.push(prefs.preferred_duration_max);
        paramIndex++;
      }
      
      // Filter by cost range if specified
      if (prefs.preferred_cost_min) {
        conditions.push(`r.estimated_cost >= $${paramIndex}`);
        params.push(prefs.preferred_cost_min);
        paramIndex++;
      }
      
      if (prefs.preferred_cost_max) {
        conditions.push(`r.estimated_cost <= $${paramIndex}`);
        params.push(prefs.preferred_cost_max);
        paramIndex++;
      }
    }
    
    // Add WHERE clause and group by
    recommendationQuery += ` WHERE ${conditions.join(' AND ')}
      GROUP BY r.id, u.id
      ORDER BY average_rating DESC
      LIMIT $${paramIndex}`;
    
    params.push(limit);
    
    // Execute query
    const result = await req.db.query(recommendationQuery, params);
    
    res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Recommended routes retrieved successfully'
    });
    
  } catch (err) {
    console.error('Get recommendations error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to retrieve recommended routes'
      }
    });
  }
});

module.exports = router;
