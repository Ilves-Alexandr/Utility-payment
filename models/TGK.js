const mongoose = require('mongoose');

const tgkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amountBilled: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  debt: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const Tgk = mongoose.model('Tgk', tgkSchema);

module.exports = Tgk;