const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Tgk = require('../models/TGK');
const User = require('../models/User')

dotenv.config();

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

// Добавить транзакцию и вычислить сальдо и долг
router.post('/tgk', auth, async (req, res) => {
    try {
        // Преобразуем входные данные в числа
        const amountBilled = Number(req.body.amountBilled);
        const amountPaid = Number(req.body.amountPaid);
        const user = req.user.id;

        console.log(`amountBilled::${amountBilled}`);
        console.dir(amountBilled)
        console.log(`amountPaid::${amountPaid}`);
        console.dir(amountPaid)

        // Проверка на NaN
        if (isNaN(amountBilled) || isNaN(amountPaid)) {
            return res.status(400).json({ msg: 'AmountBilled и AmountPaid должны быть числами' });
        }

        // Получаем последний баланс
        const lastTransaction = await Tgk.findOne().sort({ date: -1 }); //{ user }
        console.log(`lastTransaction::${lastTransaction}`);
        console.dir(lastTransaction)
        
        let previousBalance = 0;
        let previousDebt = 0;

        if (lastTransaction) {
            previousBalance = lastTransaction.balance;
            previousDebt = lastTransaction.debt;
            // Проверка типов предыдущих значений
            if (typeof previousBalance !== 'number' || typeof previousDebt !== 'number') {
                return res.status(500).json({ msg: 'Некорректные данные предыдущей транзакции' });
            }
        }
        // Подсчёт количесва пользователей
        const count = await User.countDocuments();
        // Вычисление сальдо и долга
        const balance = previousBalance + amountBilled - amountPaid;
        const debt = balance < 0 ? -balance : 0;
        // Проверка на NaN после вычислений
        if (isNaN(balance) || isNaN(debt)) {
            return res.status(400).json({ msg: 'Ошибка при вычислении баланса или долга' });
        }
        // Сохранение новой транзакции
        const newTgk = new Tgk({
            user,
            amountBilled,
            amountPaid,
            balance,
            debt,
        });
        console.log(`newTgk::${newTgk}`);
        console.dir(newTgk)

        await newTgk.save();
        res.json(newTgk);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/tgks', auth, async (req, res) => {
    console.log('Запрос на /api/tgks получен')
    try {
        // Получаем общую сумму начисленных средств
        const totalAmountBilled = await Tgk.aggregate([
            { $group: { _id: null, total: { $sum: '$amountBilled' } } },
        ]);
        console.log(`totalAmountBilled::${totalAmountBilled}`);
        console.dir(totalAmountBilled);

        if (!totalAmountBilled || totalAmountBilled.length === 0) {
            return res.status(404).json({ msg: 'Нет данных о начисленных суммах' });
        }

        // Округляем общую сумму начисленных средств до 2 знаков
        const totalAmountBilledFixed = totalAmountBilled[0].total.toFixed(2);
        console.log(totalAmountBilledFixed);

        // Получаем всех пользователей
        const users = await User.find().select('username');
        console.log('users::', users);
        // Получаем общую сумму оплаченных средств по каждому пользователю
        const totalPaid = await Tgk.aggregate([
            { $group: { _id: '$user', total: { $sum: '$amountPaid' } } },
        ]);
        console.log(`totalPaid::${totalPaid}`);
        console.dir(`totalPaid::${totalPaid}`);

        // Подключаем информацию о пользователях в результат агрегата
        const populatedTotalPaid = await User.populate(totalPaid, { path: '_id', select: 'username' });
        console.log(`populatedTotalPaid::${populatedTotalPaid}`);
        console.dir(`populatedTotalPaid::${populatedTotalPaid}`);
        

        // Рассчитываем задолженность для каждого пользователя
        const userDebts = users.map(user => {
            const userPayment = populatedTotalPaid.find(paid => String(paid._id._id) === String(user._id)) || { total: 0 };

            const eachOneBill = totalAmountBilled[0].total / users.length;
            const debt = eachOneBill - userPayment.total;

            return {
                user: user.username,
                debt: (debt > 0 ? debt : 0).toFixed(2),  // Если долг отрицательный, то устанавливаем его в 0
                totalPaid: (userPayment.total || 0).toFixed(2),  // Округляем оплаченные суммы до 2 знаков
            };
        });

        // Рассчитываем сальдо (баланс) для каждого пользователя
        const userBalances = users.map(user => {
            const userPayment = populatedTotalPaid.find(paid => String(paid._id._id) === String(user._id)) || { total: 0 };

            const eachOneBill = totalAmountBilled[0].total / users.length;
            const balance = eachOneBill - userPayment.total;

            return {
                user: user.username,
                balance: balance.toFixed(2),  // Округляем баланс до 2 знаков
                totalPaid: (userPayment.total || 0).toFixed(2),  // Округляем оплаченные суммы до 2 знаков
            };
        });

        // Получаем транзакции с подключением пользователей
        const transactions = await Tgk.find().sort({ date: -1 }).populate('user', 'username');
        console.log(`transactions::${transactions}`);
        console.dir(transactions)

        // Округляем суммы транзакций
        const fixedTransactions = transactions.map(transaction => ({
            ...transaction.toObject(),
            amountBilled: transaction.amountBilled.toFixed(2),
            amountPaid: transaction.amountPaid.toFixed(2),
        }));

        // Ответ с транзакциями, задолженностями и сальдо пользователей
        res.json({
            transactions: fixedTransactions,
            totalAmountBilled: totalAmountBilledFixed,
            totalPaid: populatedTotalPaid.map(payment => ({
                ...payment,
                total: payment.total.toFixed(2),
            })),
            userDebts,
            userBalances,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Маршрут для удаления всех транзакций
router.delete('/tgks', auth, async (req, res) => {
    try {
        const result = await Tgk.deleteMany({});
        res.json({ msg: `Удалено документов: ${result.deletedCount}` });
    } catch (err) {
        console.error('Ошибка при удалении транзакций:', err.message);
        res.status(500).send('Server error');
    }
});

// Удаление транзакции по ID
router.delete('/tgk/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Tgk.findById(id);
        if (!transaction) {
            return res.status(404).json({ msg: 'Транзакция не найдена' });
        }
        await Tgk.findByIdAndDelete(id);
        res.json({ msg: 'Транзакция удалена' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/tgk/:id', auth, async (req, res) => {
    const transactionId = req.params.id;
    try {
        const transaction = await Tgk.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

//  Редактирование транзакции по ID
router.put('/tgk/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { amountBilled, amountPaid } = req.body;
    // Проверка, что amountBilled и amountPaid — это числа
    if (isNaN(Number(amountBilled)) || isNaN(Number(amountPaid))) {
        return res.status(400).json({ msg: 'AmountBilled и AmountPaid должны быть числами' });
    }
    try {
        const transaction = await Tgk.findById(id);
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
