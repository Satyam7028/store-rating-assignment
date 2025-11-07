const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get(
  '/profile',
  protect, 
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      address: req.user.address,
    });
  }
);

router.get(
  '/admin-stuff',
  protect, 
  authorize('ADMIN'), 
  (req, res) => {
    res.json({
      success: true,
      message: 'You have accessed admin-only content!',
    });
  }
);

module.exports = router;

