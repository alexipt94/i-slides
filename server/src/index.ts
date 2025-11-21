import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Временное хранилище (в продакшене заменим на базу данных)
let presentations: any[] = [];
let presentationIdCounter = 1;

// Типы для API
interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

interface Presentation {
  id: string;
  title: string;
  slides: any[];
  createdAt: string;
  updatedAt: string;
}

interface SavePresentationRequest {
  title: string;
  slides: any[];
}

// Простой тестовый endpoint
app.get('/api/health', (req, res) => {
  const response: HealthResponse = {
    status: 'OK',
    message: 'i-slides server is running!',
    timestamp: new Date().toISOString()
  };
  res.json(response);
});

// Получить все презентации
app.get('/api/presentations', (req, res) => {
  res.json({ presentations });
});

// Получить конкретную презентацию
app.get('/api/presentations/:id', (req, res) => {
  const presentation = presentations.find(p => p.id === req.params.id);
  
  if (!presentation) {
    res.status(404).json({ error: 'Presentation not found' });
    return;
  }

  res.json(presentation);
});

// Создать новую презентацию
app.post('/api/presentations', (req, res) => {
  const { title, slides } = req.body;

  if (!title || !slides) {
    res.status(400).json({ error: 'Title and slides are required' });
    return;
  }

  const newPresentation: Presentation = {
    id: `pres_${presentationIdCounter++}`,
    title,
    slides,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  presentations.push(newPresentation);
  res.status(201).json(newPresentation);
});

// Обновить презентацию
app.put('/api/presentations/:id', (req, res) => {
  const { title, slides } = req.body;
  const presentationIndex = presentations.findIndex(p => p.id === req.params.id);

  if (presentationIndex === -1) {
    res.status(404).json({ error: 'Presentation not found' });
    return;
  }

  if (!title || !slides) {
    res.status(400).json({ error: 'Title and slides are required' });
    return;
  }

  const updatedPresentation: Presentation = {
    ...presentations[presentationIndex],
    title,
    slides,
    updatedAt: new Date().toISOString()
  };

  presentations[presentationIndex] = updatedPresentation;
  res.json(updatedPresentation);
});

// Удалить презентацию
app.delete('/api/presentations/:id', (req, res) => {
  const presentationIndex = presentations.findIndex(p => p.id === req.params.id);

  if (presentationIndex === -1) {
    res.status(404).json({ success: false });
    return;
  }

  presentations.splice(presentationIndex, 1);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Presentations API: http://localhost:${PORT}/api/presentations`);
});