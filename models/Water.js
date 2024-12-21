const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amountBilled: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  balance: { type: Number, required: true },
  debt: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Water', waterSchema);