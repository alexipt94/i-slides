// server/src/index.ts - альтернативная версия
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Используем типы из express
type ExpressRequest = express.Request;
type ExpressResponse = express.Response;

// Типы для API
interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

// Простой тестовый endpoint
app.get('/api/health', (req: ExpressRequest, res: ExpressResponse): void => {
  const response: HealthResponse = {
    status: 'OK',
    message: 'i-slides server is running!',
    timestamp: new Date().toISOString()
  };
  res.json(response);
});

app.listen(PORT, (): void => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});