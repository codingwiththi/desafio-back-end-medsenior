import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { apiLimiter } from './middleware/rateLimiter';
import routes from './routes';
import { getRedisClient } from './utils/redis';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : false,
  credentials: true,
}));

// Rate limiting
app.use('/api', apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// API routes
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  void _next; // Suppress unused variable warning
  logger.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize Redis connection
    const redis = getRedisClient();
    if (redis) {
      logger.info('Redis client initialized');
    }

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 API documentation available at http://localhost:${PORT}/api/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received, shutting down gracefully`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          // Disconnect from Redis
          const { disconnectRedis } = await import('./utils/redis');
          await disconnectRedis();
          logger.info('Redis connection closed');
          
          // Disconnect from Prisma
          const { prisma } = await import('./utils/database');
          await prisma.$disconnect();
          logger.info('Database connection closed');
          
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
