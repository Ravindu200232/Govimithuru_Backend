const mongoose = require("mongoose");

const OtherExpensesSchema = new mongoose.Schema({
    expenseName: {
        type: String,
        required: true,
    },
    expenseDescription: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    category: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
});

const OtherExpenses = mongoose.model("OtherExpenses", OtherExpensesSchema);
module.exports = OtherExpenses;
