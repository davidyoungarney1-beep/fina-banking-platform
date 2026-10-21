import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const port = Number(process.env.PORT || 4000);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(v => v.trim()) : false }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'fina-api', mode: 'scaffold', timestamp: new Date().toISOString() });
});

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error('Unhandled request error:', err?.message || 'unknown');
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => console.log(`FINA API scaffold listening on port ${port}`));