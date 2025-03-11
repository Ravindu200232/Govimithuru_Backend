const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  customerName: { type: String, required: true },
  cardName: { type: String, required: true },
  cardType: { type: String, required: true },
  cardNumber: { type: String, required: true }, // Ensure this is masked before saving
  expirationDate: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  cvv: { type: String, required: false }, // Optional now or remove this field
  date: { type: Date, default: Date.now } // Automatically set the date to now
});

module.exports = mongoose.model('Payment', PaymentSchema);
