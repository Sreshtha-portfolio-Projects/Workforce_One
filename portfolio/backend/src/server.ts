import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes';
import contactRoutes from './routes/contactRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.type('html').send(`<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Portfolio API</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 36rem; margin: 2.5rem auto; line-height: 1.55; padding: 0 1rem; color: #111; }
  code { font-size: 0.95em; }
</style>
<h1>Portfolio API</h1>
<p>This port serves the backend only. There is no page at <code>/</code> besides this note.</p>
<ul>
  <li><a href="/api">GET /api</a> — API status</li>
  <li><a href="/api/projects">/api/projects</a> — projects</li>
  <li><a href="/api/contact">/api/contact</a> — contact (POST)</li>
</ul>
<p>For the React app in development, run <code>npm run dev</code> in the <code>frontend</code> folder and open <a href="http://localhost:5173">http://localhost:5173</a> (default Vite port).</p>
`);
});

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Portfolio API is running' });
});

app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
