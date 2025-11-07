const express = require('express');
const cors = require('cors');
const { protect, authorize } = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Routes ---
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const storeRoutes = require('./routes/store');
const adminRoutes = require('./routes/admin');
const ownerRoutes = require('./routes/owner');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/owner', ownerRoutes);

app.use('/api/admin', protect, authorize('ADMIN'), adminRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});