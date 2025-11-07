const jwt = require('jsonwebtoken');
const db = require('../db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const result = await db.query(
        'SELECT id, name, email, role, address FROM users WHERE id = $1',
        [decoded.id]
      );
      
      if (result.rows.length === 0) {
          return res.status(401).json({ msg: 'Not authorized, user not found' });
      }

      req.user = result.rows[0];
      next();
    } catch (error) {
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: `User role '${req.user.role}' is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorize };

