const mongoose = require("mongoose");

const GiveChecksSchema = new mongoose.Schema({
    receiptNumber: {
        type: String,
        required: true,
        unique: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
    },
    customerPhone: {
        type: String,
        required: true,
    },
    billingAddress: {
        type: String,
        required: true,
    },
    shippingAddress: {
        type: String,
    },
    items: [{
        itemName: String,
        itemDescription: String,
        quantity: Number,
        pricePerUnit: Number,
        totalPrice: Number,
    }],
    subtotal: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    taxes: {
        type: Number,
        required: true,
    },
    shippingCost: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Confirmed', 'Pending'],
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    companyAddress: {
        type: String,
        required: true,
    },
    companyContact: {
        type: String,
        required: true,
    },
});

const GiveChecks = mongoose.model("GiveChecks", GiveChecksSchema);
module.exports = GiveChecks;
