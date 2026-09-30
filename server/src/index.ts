import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import api from './routes/api.js';
import openApi from './routes/openApi.js';
import { rateLimiter } from './middleware/auth.js';

const app = express();

// Security Hardening: Helmet with Cross-Origin Resource Policy
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Strict environment-based CORS origins
const allowedOrigins = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(',').map((s) => s.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS policy'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Rate limiting on sensitive endpoints
app.use('/api', rateLimiter(300, 60 * 1000), api);
app.use('/api/v1', openApi);

// Error handler without stack trace leak in production
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[POLARIS Error]', err.message || err);
  res.status(500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`[POLARIS Server] Listening on port ${port}`));
