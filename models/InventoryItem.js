const mongoose = require("mongoose");

const InventoryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    supName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    quantityAvailable: {
        type: Number,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0, // Ensure the price is not negative
    },
    totalPrice: {
        type: Number,
        default: 0, // Default value, can be calculated later
    },
    supplyDate: {
        type: Date,
        required: true,
        get: (v) => v ? v.toISOString().split('T')[0] : null,
        set: (v) => new Date(v.toISOString().split('T')[0]),
    },
    mfdDate: {
        type: Date,
        required: true,
        get: (v) => v ? v.toISOString().split('T')[0] : null,
        set: (v) => new Date(v.toISOString().split('T')[0]),
    },
    expireDate: {
        type: Date,
        required: true,
        get: (v) => v ? v.toISOString().split('T')[0] : null,
        set: (v) => new Date(v.toISOString().split('T')[0]),
    },
}, { toJSON: { getters: true }, toObject: { getters: true } });

// Pre-save hook to calculate totalPrice
InventoryItemSchema.pre('save', function (next) {
    this.totalPrice = this.unitPrice * this.quantityAvailable;
    next();
});

const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema);

module.exports = InventoryItem;
