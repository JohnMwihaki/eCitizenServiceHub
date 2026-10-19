import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config';
import { generalLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import { prisma } from './lib/prisma';

// Import route modules
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import requestRoutes from './routes/request.routes';
import notificationRoutes from './routes/notification.routes';
import dashboardRoutes from './routes/dashboard.routes';
import aiRoutes from './routes/ai.routes';

const app: Application = express();

// Security and middleware setup
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin 
      if (!origin) return callback(null, true);
      if (
        config.corsOrigin.includes(origin) ||
        config.corsOrigin.includes('*') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads with proper cross-origin policy
app.use('/uploads', express.static(config.uploadDir));

// Rate limiting
app.use('/api', generalLimiter);



// County public metadata
app.get('/api/county-info', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: config.countyInfo,
  });
});

// modular routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
