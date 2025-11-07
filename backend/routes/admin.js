const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stats', async (req, res) => {
  try {
    const userCountPromise = db.query('SELECT COUNT(*) FROM users');
    const storeCountPromise = db.query('SELECT COUNT(*) FROM stores');
    const ratingCountPromise = db.query('SELECT COUNT(*) FROM ratings');

    const [userCountRes, storeCountRes, ratingCountRes] = await Promise.all([
      userCountPromise,
      storeCountPromise,
      ratingCountPromise,
    ]);

    res.json({
      userCount: parseInt(userCountRes.rows[0].count, 10),
      storeCount: parseInt(storeCountRes.rows[0].count, 10),
      ratingCount: parseInt(ratingCountRes.rows[0].count, 10),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/users', async (req, res) => {
  const { sortBy = 'id', order = 'asc', role } = req.query;
  const validSortColumns = ['id', 'name', 'email', 'role', 'created_at'];
  const validOrders = ['asc', 'desc'];
  const validRoles = ['USER', 'ADMIN', 'OWNER'];

  if (!validSortColumns.includes(sortBy) || !validOrders.includes(order)) {
    return res.status(400).json({ msg: 'Invalid sort parameters' });
  }
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ msg: 'Invalid role filter' });
  }

  let query = `SELECT id, name, email, role, created_at FROM users`;
  const params = [];
  let paramIndex = 1;

  if (role) {
    query += ` WHERE role = $${paramIndex}`;
    params.push(role);
    paramIndex++;
  }

  query += ` ORDER BY "${sortBy}" ${order.toUpperCase()}`;

  try {
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['USER', 'ADMIN', 'OWNER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: 'Invalid role specified' });
    }

    const { rows } = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/users/:id/rating', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.query('SELECT role FROM users WHERE id = $1', [id]);
    if (user.rows.length === 0) return res.status(404).json({ msg: 'User not found' });
    if (user.rows[0].role !== 'OWNER') return res.status(400).json({ msg: 'User is not an owner' });

    const { rows } = await db.query(`
      SELECT COALESCE(AVG(r.rating_value), 0) as averageRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = $1
    `, [id]);
    res.json({ averageRating: parseFloat(rows[0].averageRating).toFixed(1) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/users', async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }

  if (name.length < 20 || name.length > 60) {
    return res.status(400).json({ msg: 'Name must be between 20 and 60 characters' });
  }
  if (address && address.length > 400) {
    return res.status(400).json({ msg: 'Address must be 400 characters or less' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: 'Invalid email format' });
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ msg: 'Password must be 8-16 characters, include at least one uppercase letter and one special character' });
  }
  const validRoles = ['USER', 'ADMIN', 'OWNER'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ msg: 'Invalid role specified' });
  }

  try {
    let user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

