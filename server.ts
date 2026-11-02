import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import healthHandler from './api/health';
import analyzeHandler from './api/analyze';
import parseJobHandler from './api/parse-job';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes mapped directly to Vercel Serverless Function handlers
  app.all('/api/health', (req, res) => {
    return healthHandler(req as any, res as any);
  });

  app.all('/api/analyze', (req, res) => {
    return analyzeHandler(req as any, res as any);
  });

  app.all('/api/parse-job', (req, res) => {
    return parseJobHandler(req as any, res as any);
  });

  // Serve static files in production or Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JOB FIT AI server running on port ${PORT}`);
  });
}

startServer();
