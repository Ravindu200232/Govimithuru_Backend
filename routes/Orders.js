const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const AvailableItem = require('../models/AvailableItem');

// Middleware for validating request body
const validateOrder = (req, res, next) => {
    const { customerName, address, postalCode, email, phoneNumber, paymentType, productDetails } = req.body;

    if (!customerName || !address || !postalCode || !email || !phoneNumber || !paymentType || !productDetails || !Array.isArray(productDetails)) {
        return res.status(400).json({ status: "Error", error: "Missing required fields" });
    }

    for (const product of productDetails) {
        const { itemName, quantitySold, itemPrice, totalPrice } = product;
        if (!itemName || quantitySold == null || itemPrice == null || totalPrice == null) {
            return res.status(400).json({ status: "Error", error: "Missing product details" });
        }
    }

    next();
};

// Function to create an order and update available items
async function createOrder(orderData) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create the order
        const order = new Order(orderData);
        await order.save({ session });

        // Update available items
        for (const product of orderData.productDetails) {
            const availableItem = await AvailableItem.findOne({ name: product.itemName }).session(session);
            if (!availableItem) {
                throw new Error(`Item ${product.itemName} not found.`);
            }
            if (availableItem.availableItem < product.quantitySold) {
                throw new Error(`Insufficient stock for ${product.itemName}.`);
            }

            availableItem.availableItem -= product.quantitySold;
            await availableItem.save({ session });
        }

        await session.commitTransaction();
        session.endSession();
        return order;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Error fetching orders", error: err.message });
    }
});

// Add a new order
router.post('/add', validateOrder, async (req, res) => {
    try {
        const order = await createOrder(req.body);
        res.status(201).json({ status: "Success", message: "Order Added", order });
    } catch (error) {
        res.status(400).json({ status: "Error", message: error.message });
    }
});

// Update an order
router.put('/update/:id', validateOrder, async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!order) {
            return res.status(404).json({ status: "Error", message: "Order not found" });
        }
        res.status(200).json({ status: "Success", message: "Order Updated", order });
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Error updating order", error: err.message });
    }
});

// Delete an order
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ status: "Error", message: "Order not found" });
        }
        res.status(200).json({ status: "Success", message: "Order Deleted" });
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Error deleting order", error: err.message });
    }
});


// Get orders by customer name
router.get('/by-customer', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ status: "Error", message: "Email is required" });
    }

    try {
        // Find orders using the email instead of customerName
        const orders = await Order.find({ email });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Error fetching orders", error: err.message });
    }
});


// Get all cash orders
router.get('/cash-orders', async (req, res) => {
    try {
        const cashOrders = await Order.find({ paymentType: 'cash' });
        res.status(200).json(cashOrders);
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Error fetching cash orders", error: err.message });
    }
});



module.exports = router;
