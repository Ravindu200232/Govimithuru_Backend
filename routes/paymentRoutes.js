const express = require('express');
const Payment = require('../models/Payment');
const crypto = require('crypto');

const router = express.Router();

// Create a new payment
router.post('/add', async (req, res) => {
  try {
    const { customerName, cardName, cardType, cardNumber, expirationDate, totalPrice } = req.body;

    // Ensure cardNumber is received from the frontend and mask it
    const maskedCardNumber = `**** **** **** ${cardNumber.slice(-4)}`;

    // Create new payment instance
    const newPayment = new Payment({
      customerName,
      cardName,
      cardType,
      cardNumber: maskedCardNumber,  // Save masked card number
      expirationDate,
      totalPrice,
    });

    // Save to database
    await newPayment.save();

    res.status(201).json({ message: 'Payment saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save payment.' });
  }
});


// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve payments.' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the payment
    const deletedPayment = await Payment.findByIdAndDelete(id);
    
    if (!deletedPayment) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    res.status(200).json({ message: 'Payment deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete payment.' });
  }
});


module.exports = router;
