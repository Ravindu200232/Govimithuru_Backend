const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Delivery schema definition
const deliverySchema = new mongoose.Schema({
    deliveryPersonName: { type: String, required: true },
    deliveryDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ }, // Simple email validation
    phoneNumber: { type: String, required: true },
    driverName: { type: String, required: false },
    deliveryType: { type: String, enum: ['standard', 'express'], required: true },
    deliveryDetails: [
        {
            itemName: { type: String, required: true },
            quantity: { type: Number, required: true },
            itemPrice: { type: Number, required: true },
            totalPrice: { type: Number, required: true }
        }
    ]
});



// Export the Delivery model
module.exports = mongoose.model('Delivery', deliverySchema);
