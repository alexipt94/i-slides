import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🗄️ ВРЕМЕННОЕ ХРАНИЛИЩЕ ДЛЯ ПРЕЗЕНТАЦИЙ
let presentations: any[] = [];
let presentationIdCounter = 1;

// 🩺 Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('❤️ GET /api/health');
  res.json({
    status: 'OK',
    message: 'i-slides server is running!',
    timestamp: new Date().toISOString(),
    presentationsCount: presentations.length
  });
});

// 📥 ПОЛУЧИТЬ ВСЕ ПРЕЗЕНТАЦИИ
app.get('/api/presentations', (req, res) => {
  console.log('📚 GET /api/presentations - Current count:', presentations.length);
  res.json({ presentations });
});

// 📥 ПОЛУЧИТЬ КОНКРЕТНУЮ ПРЕЗЕНТАЦИЮ
app.get('/api/presentations/:id', (req, res) => {
  console.log('📄 GET /api/presentations/:id - ID:', req.params.id);
  const presentation = presentations.find(p => p.id === req.params.id);
  
  if (!presentation) {
    console.log('❌ Presentation not found');
    res.status(404).json({ error: 'Presentation not found' });
    return;
  }

  console.log('✅ Presentation found:', presentation.title);
  res.json(presentation);
});

// ➕ СОЗДАТЬ НОВУЮ ПРЕЗЕНТАЦИЮ
app.post('/api/presentations', (req, res) => {
  console.log('🆕 === POST /api/presentations ===');
  console.log('📦 Request body:', req.body);
  
  const { title, slides } = req.body;
  
  if (!title || !slides) {
    console.log('❌ Missing title or slides');
    res.status(400).json({ error: 'Title and slides are required' });
    return;
  }

  const newPresentation = {
    id: `pres_${presentationIdCounter++}`,
    title,
    slides,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  presentations.push(newPresentation);
  
  console.log('✅ Created presentation:', newPresentation);
  console.log('📊 Total presentations now:', presentations.length);
  
  res.status(201).json(newPresentation);
});

// ✏️ ОБНОВИТЬ ПРЕЗЕНТАЦИЮ
app.put('/api/presentations/:id', (req, res) => {
  console.log('✏️ === PUT /api/presentations/:id ===');
  console.log('🆔 ID:', req.params.id);
  console.log('📦 Request body:', req.body);
  
  const { title, slides } = req.body;
  const presentationIndex = presentations.findIndex(p => p.id === req.params.id);

  if (presentationIndex === -1) {
    console.log('❌ Presentation not found for update');
    res.status(404).json({ error: 'Presentation not found' });
    return;
  }

  if (!title || !slides) {
    console.log('❌ Missing title or slides for update');
    res.status(400).json({ error: 'Title and slides are required' });
    return;
  }

  const updatedPresentation = {
    ...presentations[presentationIndex],
    title,
    slides,
    updatedAt: new Date().toISOString()
  };

  presentations[presentationIndex] = updatedPresentation;
  
  console.log('✅ Updated presentation:', updatedPresentation);
  
  res.json(updatedPresentation);
});

// 🗑️ УДАЛИТЬ ПРЕЗЕНТАЦИЮ
app.delete('/api/presentations/:id', (req, res) => {
  console.log('🗑️ DELETE /api/presentations/:id - ID:', req.params.id);
  const presentationIndex = presentations.findIndex(p => p.id === req.params.id);

  if (presentationIndex === -1) {
    console.log('❌ Presentation not found for deletion');
    res.status(404).json({ success: false });
    return;
  }

  const deletedPresentation = presentations[presentationIndex];
  presentations.splice(presentationIndex, 1);
  
  console.log('✅ Deleted presentation:', deletedPresentation.title);
  console.log('📊 Total presentations now:', presentations.length);
  
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Presentations API: http://localhost:${PORT}/api/presentations`);
});