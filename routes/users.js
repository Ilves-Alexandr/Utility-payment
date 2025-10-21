const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware для проверки токена
function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded.user;

        next();
    } catch (err) {
        res.status(401).json({ msg: `Вы неавторизованы!:: ${err}` });
    }
}

// Удаление всех пользователей
router.delete('/users', auth, async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ msg: `Удалено пользователей: ${result.deletedCount}` });
  } catch (err) {
    console.error('Ошибка при удалении пользователей:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
