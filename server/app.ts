import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = async (): Promise<Express> => {
  const app = express();

  // Core middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Express API Routes (Supports both /api and /api/v1)
  app.use('/api', apiRoutes);
  app.use('/api/v1', apiRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development: Integrate Vite Server as Express Middleware (Single Port + HMR)
    console.log('[Express] Initializing Vite Server in Middleware Mode (Dev)...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static build from dist folder
    console.log('[Express] Serving static production build from /dist...');
    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'), (err) => {
          if (err) {
            res.status(404).send('Production build not found. Please run "npm run build" first.');
          }
        });
      } else {
        res.status(404).json({ success: false, message: 'API Endpoint not found' });
      }
    });
  }

  return app;
};
