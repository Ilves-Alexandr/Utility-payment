const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amountBilled: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  debt: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;