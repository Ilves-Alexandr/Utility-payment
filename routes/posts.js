const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Post = require('../models/Post');
const checkRole = require('../middleware/role');

dotenv.config();

// Middleware для проверки токена
function auth(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    console.log(req.user);
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: `Вы неавторизованы!:: ${err}` });
  }
}

// Добавление поста
router.post('/', auth, checkRole(['editor', 'admin']), async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      user: req.user.id,

    });
    const post = await newPost.save();
    console.log(post);
    res.json(post);
  } catch (err) {
    console.error(err.message); // Добавляем логирование ошибок
    res.status(500).send('Server error');
  }
});

// Получение всех постов
router.get('/', auth, checkRole(['viewer', 'editor', 'admin']), async (req, res) => {
  try {
    const posts = await Post.find().populate('user', ['name', 'email']);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Маршрут для получения поста по ID
router.get('/:id', auth, checkRole(['viewer', 'editor', 'admin']), async (req, res) => {
  try {
    // Найти пост по ID
    let post = await Post.findById(req.params.id);

    // Проверить, существует ли пост
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Маршрут для обновления (редактирования) поста
router.put('/:id', auth, checkRole(['editor', 'admin']), async (req, res) => {
  try {
    // Найти пост по ID
    let post = await Post.findById(req.params.id);

    // Проверить, существует ли пост
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Проверить, является ли текущий пользователь владельцем поста
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Обновить пост с новыми данными
    const updatedData = {
      title: req.body.title,
      content: req.body.content,
    };

    post = await Post.findByIdAndUpdate(req.params.id, updatedData, {
      new: true, // Возвращает обновленный пост
    });

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Маршрут для удаления всех постов
router.delete('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const result = await Post.deleteMany({});
    res.json({ msg: `Удалено документов: ${result.deletedCount}` });
  } catch (err) {
    console.error('Ошибка при удалении транзакций:', err.message);
    res.status(500).send('Server error');
  }
});

// Маршрут для удаления поста
router.delete('/:id', auth, checkRole(['editor', 'admin']), async (req, res) => {
  try {
    // Найти пост по ID
    let post = await Post.findById(req.params.id);

    // Проверить, существует ли пост
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Проверить, является ли текущий пользователь владельцем поста
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Удалить пост
    await Post.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
