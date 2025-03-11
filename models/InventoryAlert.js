const mongoose = require("mongoose");

const InventoryAlertSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "AvailableItem",
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const InventoryAlert = mongoose.model("InventoryAlert", InventoryAlertSchema);

module.exports = InventoryAlert;
