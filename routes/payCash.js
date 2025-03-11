// routes/payCash.js
const express = require('express');
const mongoose = require('mongoose');
const PayCash = require('../models/PayCash');
const router = express.Router();

// Confirm payment
router.post('/confirm', async (req, res) => {
    const { orderId, amountPaid, signature, customerName, customerAddress, customerPhoneNumber } = req.body;

    try {
        const newPayment = new PayCash({
            orderId,
            amountPaid,
            signature,
            customerName,
            customerAddress,
            customerPhoneNumber
        });

        await newPayment.save();
        res.status(201).json({ message: 'Payment confirmed successfully!', payment: newPayment });
    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ message: 'Error confirming payment', error });
    }
});




router.get('/', async (req, res) => {
    try {
        const payments = await PayCash.find();
        res.status(200).json({ status: "Success", message: "Payments retrieved successfully", payments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: "Failed to retrieve payments", error: error.message });
    }
});

// Delete payment by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPayment = await PayCash.findByIdAndDelete(id);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully', payment: deletedPayment });
    } catch (error) {
        console.error("Error deleting payment:", error);
        res.status(500).json({ message: 'Error deleting payment', error });
    }
});


module.exports = router;

