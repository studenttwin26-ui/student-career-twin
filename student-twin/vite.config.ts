process.env.VITE_CONFIG_NATIVE_IGNORE_WARNING = 'true';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import express from 'express';
import apiRouter from './server/apiRouter';

function expressApiPlugin(): Plugin {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiRouter);

  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url === '/api' || req.url.startsWith('/api/') || req.url.startsWith('/api?'))) {
          app(req as any, res as any, next);
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    base: (process.env.VITE_BASE_PATH && process.env.VITE_BASE_PATH.startsWith('/')) ? process.env.VITE_BASE_PATH : '/',
    plugins: [
      react(),
      tailwindcss(),
      expressApiPlugin()
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
