const mongoose = require("mongoose");

const FinanceSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    itemId: {
        type: Number,  // Changed from ObjectId to Number
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    itemPrice: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        // This getter formats the date when retrieving from the database
        get: (v) => v.toISOString().split('T')[0],
        // This setter ensures only the date is stored, not the time
        set: (v) => new Date(v.toISOString().split('T')[0]),
    },
    quantity: {
        type: Number,
        required: true,
    },
    fullAmount: {
        type: Number,
        required: true,
    },
    paymentOption: {
        type: String,
        required: true,
    },
    paidPrice: {
        type: Number,
        required: true,
    },
    debt: {
        type: Number,
        required: true,
    },
}, { toJSON: { getters: true }, toObject: { getters: true } });

const Finance = mongoose.model("Finance", FinanceSchema);

module.exports = Finance;
