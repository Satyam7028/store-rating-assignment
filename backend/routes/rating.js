const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');

const checkStoreOwner = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { rows } = await db.query('SELECT owner_id FROM stores WHERE id = $1', [storeId]);

    if (rows.length > 0 && rows[0].owner_id === req.user.id) {
      return res.status(403).json({ msg: 'Store owners cannot rate their own store.' });
    }
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
};

router.post('/', protect, checkStoreOwner, async (req, res) => {
  const { rating_value } = req.body;
  const { storeId } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await db.query(
      'INSERT INTO ratings (rating_value, user_id, store_id) VALUES ($1, $2, $3) RETURNING *',
      [rating_value, userId, storeId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ msg: 'You have already rated this store.' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/', protect, checkStoreOwner, async (req, res) => {
  const { rating_value } = req.body;
  const { storeId } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await db.query(
      'UPDATE ratings SET rating_value = $1 WHERE user_id = $2 AND store_id = $3 RETURNING *',
      [rating_value, userId, storeId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Rating not found for this user and store.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;