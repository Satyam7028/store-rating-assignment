const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, authorize } = require('../middleware/authMiddleware');
const ratingRoutes = require('./rating');

router.use('/:storeId/ratings', ratingRoutes);

router.get('/', async (req, res) => {
  const { sortBy = 'created_at', order = 'desc', name, address } = req.query;
  const validSortColumns = ['name', 'created_at', 'averageRating', 'ratingCount'];
  const validOrders = ['asc', 'desc'];
  if (!validSortColumns.includes(sortBy) || !validOrders.includes(order)) {
    return res.status(400).json({ msg: 'Invalid sort parameters' });
  }

  const userId = req.user ? req.user.id : null;

  try {
    let query = `
      SELECT
        s.*,
        COALESCE(AVG(r.rating_value), 0) as "averageRating",
        COUNT(r.id) as "ratingCount"
    `;
    if (userId) {
      query += `,
        ur.rating_value as "userRating"
      `;
    }
    query += `
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    if (userId) {
      query += `
        LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
      `;
    }
    query += `
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (userId) {
      params.push(userId);
      paramIndex++;
    }

    if (name) {
      query += ` AND s.name ILIKE $${paramIndex}`;
      params.push(`%${name}%`);
      paramIndex++;
    }

    if (address) {
      query += ` AND s.address ILIKE $${paramIndex}`;
      params.push(`%${address}%`);
      paramIndex++;
    }

    query += `
      GROUP BY s.id
    `;
    if (userId) {
      query += `, ur.rating_value`;
    }
    query += `
      ORDER BY "${sortBy}" ${order.toUpperCase()};
    `;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        s.*, 
        COALESCE(AVG(r.rating_value), 0) as "averageRating",
        COUNT(r.id) as "ratingCount"
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id;
    `;
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Store not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/', protect, authorize('ADMIN'), async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *'
      [name, email, address, ownerId || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
