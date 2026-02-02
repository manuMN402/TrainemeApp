import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TraineMe Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      trainers: '/api/trainers',
      availability: '/api/availability',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      health: '/health'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`📝 Access from network: http://192.168.0.228:${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
});

export default app;
