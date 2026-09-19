import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import apiRouter from './server/apiRouter';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Backend API routes
app.use('/api', apiRouter);

// Serve static frontend in production
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Student Twin production server running on port ${PORT}`);
});
