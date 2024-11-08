const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Импортируйте вашу модель пользователя

// Удаление всех пользователей
router.delete('/users', async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ msg: `Удалено пользователей: ${result.deletedCount}` });
  } catch (err) {
    console.error('Ошибка при удалении пользователей:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
