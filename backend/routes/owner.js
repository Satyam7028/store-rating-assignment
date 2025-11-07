const express = require('express');
const db = require('../db');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, authorize('OWNER'), async (req, res) => {
  try {
    const ownerId = req.user.id;

    const query = `
      SELECT
        s.id,
        s.name,
        s.address,
        COALESCE(AVG(r.rating_value), 0) AS "averageRating",
        COUNT(r.id) AS "ratingCount",
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', u.id,
            'name', u.name,
            'email', u.email
          )
        ) FILTER (WHERE r.id IS NOT NULL) AS "raters"
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE s.owner_id = $1
      GROUP BY s.id;
    `;

    const { rows } = await db.query(query, [ownerId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'No store found for this owner.' });
    }

    const storeData = rows[0];
    storeData.averageRating = parseFloat(storeData.averageRating).toFixed(2);

    res.json(storeData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
