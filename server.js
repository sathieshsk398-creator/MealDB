import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './backend/config/db.js';
import authRoutes from './backend/routes/authRoutes.js';
import cartRoutes from './backend/routes/cartRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Core Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root info & health check endpoints
app.get('/', (req, res) => {
  res.json({
    name: 'MealDB Food Delivery Backend API',
    status: 'online',
    version: '1.0.0',
    port: PORT,
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (Protected)',
      },
      cart: {
        getCart: 'GET /api/cart (Protected)',
        addItem: 'POST /api/cart (Protected)',
        removeItemParam: 'DELETE /api/cart/:idMeal (Protected)',
        removeItemBody: 'DELETE /api/cart (Protected with idMeal in body)',
      },
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MealDB Backend Server running at http://localhost:${PORT}`);
  console.log(`📡 Auth endpoints available at http://localhost:${PORT}/api/auth`);
  console.log(`🛒 Cart endpoints available at http://localhost:${PORT}/api/cart`);
});

export default app;
