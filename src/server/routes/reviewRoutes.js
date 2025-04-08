
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

// Get reviews for a route
router.get('/:routeId/reviews', async (req, res) => {
  try {
    const { routeId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Check if route exists
    const routeCheck = await req.db.query(
      'SELECT id FROM routes WHERE id = $1',
      [routeId]
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
    
    // Get reviews with user info
    const reviewsQuery = `
      SELECT 
        r.id, r.rating, r.comment, r.visited_date, r.created_at,
        u.id as user_id, u.username, u.profile_image_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.route_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const reviewsResult = await req.db.query(reviewsQuery, [routeId, limit, offset]);
    
    // Get review count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reviews
      WHERE route_id = $1
    `;
    
    const countResult = await req.db.query(countQuery, [routeId]);
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: {
        reviews: reviewsResult.rows,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      },
      message: 'Reviews retrieved successfully'
    });
    
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to retrieve reviews'
      }
    });
  }
});

// Add a review to a route
router.post('/:routeId/reviews', authenticate, async (req, res) => {
  try {
    const { routeId } = req.params;
    const { rating, comment, visited_date } = req.body;
    
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_RATING',
          message: 'Rating is required and must be between 1 and 5'
        }
      });
    }
    
    // Check if route exists
    const routeCheck = await req.db.query(
      'SELECT id FROM routes WHERE id = $1',
      [routeId]
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
    
    // Check if user already reviewed this route
    const existingReview = await req.db.query(
      'SELECT id FROM reviews WHERE route_id = $1 AND user_id = $2',
      [routeId, req.user.id]
    );
    
    if (existingReview.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'REVIEW_EXISTS',
          message: 'You have already reviewed this route'
        }
      });
    }
    
    // Add review
    const result = await req.db.query(
      `INSERT INTO reviews (route_id, user_id, rating, comment, visited_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, rating, comment, visited_date, created_at`,
      [routeId, req.user.id, rating, comment, visited_date]
    );
    
    const newReview = result.rows[0];
    
    res.status(201).json({
      success: true,
      data: {
        ...newReview,
        user: {
          id: req.user.id,
          username: req.user.username
        }
      },
      message: 'Review added successfully'
    });
    
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to add review'
      }
    });
  }
});

// Update a review
router.put('/:routeId/reviews/:reviewId', authenticate, async (req, res) => {
  try {
    const { routeId, reviewId } = req.params;
    const { rating, comment, visited_date } = req.body;
    
    // Validate input
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_RATING',
          message: 'Rating must be between 1 and 5'
        }
      });
    }
    
    // Check if review exists and belongs to user
    const reviewCheck = await req.db.query(
      'SELECT user_id FROM reviews WHERE id = $1 AND route_id = $2',
      [reviewId, routeId]
    );
    
    if (reviewCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REVIEW_NOT_FOUND',
          message: 'Review not found'
        }
      });
    }
    
    if (reviewCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this review'
        }
      });
    }
    
    // Update review
    const result = await req.db.query(
      `UPDATE reviews
       SET rating = COALESCE($1, rating),
           comment = COALESCE($2, comment),
           visited_date = COALESCE($3, visited_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING id, rating, comment, visited_date, updated_at`,
      [rating, comment, visited_date, reviewId, req.user.id]
    );
    
    const updatedReview = result.rows[0];
    
    res.status(200).json({
      success: true,
      data: updatedReview,
      message: 'Review updated successfully'
    });
    
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update review'
      }
    });
  }
});

// Delete a review
router.delete('/:routeId/reviews/:reviewId', authenticate, async (req, res) => {
  try {
    const { routeId, reviewId } = req.params;
    
    // Check if review exists and belongs to user
    const reviewCheck = await req.db.query(
      'SELECT user_id FROM reviews WHERE id = $1 AND route_id = $2',
      [reviewId, routeId]
    );
    
    if (reviewCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REVIEW_NOT_FOUND',
          message: 'Review not found'
        }
      });
    }
    
    if (reviewCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this review'
        }
      });
    }
    
    // Delete review
    await req.db.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
    
    res.status(204).send();
    
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete review'
      }
    });
  }
});

module.exports = router;
