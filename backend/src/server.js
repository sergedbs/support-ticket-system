import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './utils/swagger.js';
import tokenRouter from './routes/token.js';
import ticketRouter from './routes/tickets.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || '127.0.0.1';
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/token', tokenRouter);
app.use('/tickets', ticketRouter);

app.use((request, response) => {
  response.status(404).json({ error: `Route ${request.method} ${request.path} not found` });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(error.status || 500).json({ error: error.message || 'Internal server error' });
});

app.listen(port, host, () => {
  console.log(`API listening on http://${host}:${port}`);
});
