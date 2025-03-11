const mongoose = require("mongoose");

// Define the Card Schema
const CardSchema = new mongoose.Schema({
    itemNamec: {
        type: String,
        required: [true, "Item name is required"],
    },
    categoryc: {
        type: String,
        required: [true, "Category is required"],
    },
    pricec: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"]
    },
    available: {
        type: Number,
        required: [true, "Available count is required"],
        min: [0, "Available count must be a non-negative number"]
    },
    quantityc: {
        type: Number,
        default: 1,
        min: [1, "Quantity must be at least 1"]
    },
    imagec: {
        type: String, // Store image as base64 string
        required: true
    }
}, { 
    timestamps: true  // Automatically manage createdAt and updatedAt fields
});


// Create the Card model
const Card = mongoose.model("Card", CardSchema);

// Export the Card model
module.exports = Card;
