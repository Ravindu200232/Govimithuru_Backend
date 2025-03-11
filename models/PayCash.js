// models/PayCash.js
const mongoose = require('mongoose');

const payCashSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amountPaid: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    signature: { type: String }, // You can change this based on how you want to store the signature (e.g., as a URL to an image)
    customerName: { type: String, required: true }, // New field for customer name
    customerAddress: { type: String, required: true }, // New field for customer address
    customerPhoneNumber: { type: String, required: true } // New field for customer phone number
});

const PayCash = mongoose.model('PayCash', payCashSchema);
module.exports = PayCash;
