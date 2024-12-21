const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const auth = require('./routes/auth')
const posts = require('./routes/posts')
const transactionRoutes = require('./routes/transactions');
const tgkRouter = require('./routes/tgk');
const waterRouter = require('./routes/water')
const usersRouter = require('./routes/users');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use(cors({
  origin: '*', // Укажите источник или используйте '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json());

// Обслуживание файлов из папки build
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Обработка всех запросов и возврат index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Любой другой маршрут отправляет `index.html`
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// Маршруты
app.use('/api/users', auth);
app.use('/api/posts', posts);
app.use('/api', transactionRoutes);
app.use('/api', tgkRouter);
app.use('/api', waterRouter)
app.use('/api', usersRouter);

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);  // Выводим стек ошибки в консоль
  res.status(500).send('Something went wrong!');
});

app.use((req, res, next) => {
  console.log(`CORS policy check for ${req.method} ${req.url}`);
  next();
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
