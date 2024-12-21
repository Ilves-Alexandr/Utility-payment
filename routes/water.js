const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Water = require('../models/Water');
const User = require('../models/User');

dotenv.config();

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

// Добавление транзакции для водоканала
router.post('/water', auth, async (req, res) => {
  try {
    const amountBilled = Number(req.body.amountBilled);
    const amountPaid = Number(req.body.amountPaid);
    const user = req.user.id;

    if (isNaN(amountBilled) || isNaN(amountPaid)) {
      return res.status(400).json({ msg: 'AmountBilled и AmountPaid должны быть числами' });
    }

    const lastTransaction = await Water.findOne().sort({ date: -1 });

    let previousBalance = 0;
    if (lastTransaction) {
      previousBalance = lastTransaction.balance;
    }

    const balance = previousBalance + amountBilled - amountPaid;
    const debt = balance < 0 ? -balance : 0;

    const newTransaction = new Water({
      user,
      amountBilled,
      amountPaid,
      balance,
      debt,
    });

    await newTransaction.save();
    res.json(newTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Получение всех транзакций для водоканала
router.get('/waters', auth, async (req, res) => {

  try {
    const totalAmountBilled = await Water.aggregate([
      { $group: { _id: null, total: { $sum: '$amountBilled' } } },
    ]);

    if (!totalAmountBilled || totalAmountBilled.length === 0) {
      return res.status(404).json({ msg: 'Нет данных о начисленных суммах' });
    }

    const users = await User.find().select('username');
    const totalPaid = await Water.aggregate([
      { $group: { _id: '$user', total: { $sum: '$amountPaid' } } },
    ]);

    const populatedTotalPaid = await User.populate(totalPaid, { path: '_id', select: 'username' });

    const userDebts = users.map(user => {
      const userPayment = populatedTotalPaid.find(paid => String(paid._id._id) === String(user._id)) || { total: 0 };
      const eachOneBill = totalAmountBilled[0].total / users.length;
      const debt = eachOneBill - userPayment.total;

      return {
        user: user.username,
        debt: (debt > 0 ? debt : 0).toFixed(2),
        totalPaid: (userPayment.total || 0).toFixed(2),
      };
    });

    const userBalances = users.map(user => {
      const userPayment = populatedTotalPaid.find(paid => String(paid._id._id) === String(user._id)) || { total: 0 };
      const eachOneBill = totalAmountBilled[0].total / users.length;
      const balance = eachOneBill - userPayment.total;

      return {
        user: user.username,
        balance: balance.toFixed(2),
        totalPaid: (userPayment.total || 0).toFixed(2),
      };
    });
    const transactions = await Water.find().sort({ date: -1 }).populate('user', 'username');
    console.log('GET /api/waters');
    console.log('Total Amount Billed:', totalAmountBilled);
    console.log('User Balances:', userBalances);
    console.log('User Debts:', userDebts);
    console.log('Transactions:', transactions);
    res.json({
      transactions,
      totalAmountBilled: totalAmountBilled[0].total.toFixed(2),
      userDebts,
      userBalances,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Маршрут для удаления всех транзакций
router.delete('/waters', auth, async (req, res) => {
  try {
    const result = await Water.deleteMany({});
    res.json({ msg: `Удалено документов: ${result.deletedCount}` });
  } catch (err) {
    console.error('Ошибка при удалении транзакций:', err.message);
    res.status(500).send('Server error');
  }
});

// Удаление транзакции по ID
router.delete('/water/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Water.findById(id);
    if (!transaction) {
      return res.status(404).json({ msg: 'Транзакция не найдена' });
    }
    await Water.findByIdAndDelete(id);
    res.json({ msg: 'Транзакция удалена' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/water/:id', async (req, res) => {
  const transactionId = req.params.id;
  try {
    const transaction = await Water.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

//  Редактирование транзакции по ID
router.put('/water/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { amountBilled, amountPaid } = req.body;
  // Проверка, что amountBilled и amountPaid — это числа
  if (isNaN(Number(amountBilled)) || isNaN(Number(amountPaid))) {
    return res.status(400).json({ msg: 'AmountBilled и AmountPaid должны быть числами' });
  }
  try {
    const transaction = await Water.findById(id);
    if (!transaction) {
      return res.status(404).json({ msg: 'Транзакция не найдена' });
    }
    // Обновляем поля транзакции
    transaction.amountBilled = Number(amountBilled);
    transaction.amountPaid = Number(amountPaid);
    transaction.balance = transaction.balance + amountBilled - amountPaid; // Перерасчет сальдо
    transaction.debt = transaction.balance < 0 ? -transaction.balance : 0;
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
