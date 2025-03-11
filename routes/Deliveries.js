const express = require('express');
const router = express.Router();
const Delivery = require('../models/Deliver');
const nodemailer = require('nodemailer');

// Middleware for validating request body
const validateDelivery = (req, res, next) => {
    const { deliveryPersonName, deliveryDate, status, address, postalCode, email, phoneNumber, deliveryType, deliveryDetails } = req.body;
    if (!deliveryPersonName || !deliveryDate || !status || !address || !postalCode || !email || !phoneNumber || !deliveryType || !deliveryDetails) {
        return res.status(400).json({ status: "Error", error: "Missing required fields" });
    }
    next();
};

// Get all deliveries
router.get('/', async (req, res) => {
    try {
        const deliveries = await Delivery.find({});
        res.status(200).json(deliveries);
    } catch (err) {
        res.status(500).json({ status: "Error with fetching deliveries", error: err.message });
    }
});

// Add a new delivery
router.post('/add', validateDelivery, async (req, res) => {
    const newDelivery = new Delivery(req.body);

    try {
        await newDelivery.save();
        res.status(201).json({ status: "Success", message: "Delivery Added" });
    } catch (err) {
        res.status(500).json({ status: "Error with adding delivery", error: err.message });
    }
});

// Confirm delivery and send email
router.post('/confirm/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const delivery = await Delivery.findById(id);
        if (!delivery) {
            return res.status(404).json({ status: "Error", error: "Delivery not found" });
        }

        // Update the status to "Delivered"
        delivery.status = "Delivered";
        await delivery.save();

        // Send email notification to the customer
        const emailContent = createDeliveryEmailContent(delivery);
        await sendDeliveryEmail(delivery.email, 'Your Order is Out for Delivery', emailContent);

        res.status(200).json({ status: "Success", message: "Delivery Confirmed and Email Sent" });
    } catch (err) {
        res.status(500).json({ status: "Error with confirming delivery", error: err.message });
    }
});

// Function to create the HTML content for the delivery email
function createDeliveryEmailContent(delivery) {
    let itemsHtml = '';
    delivery.deliveryDetails.forEach(item => {
        itemsHtml += `
            <tr>
                <td>${item.itemName}</td>
                <td>${item.quantity}</td>
                <td>${item.itemPrice}</td>
                <td>${item.totalPrice}</td>
            </tr>
        `;
    });

    return `
        <h1>Your Order is Out for Delivery</h1>
        <p>Dear Customer,</p>
        <p>Your order has been dispatched and is on its way!</p>
        <p>Delivery Details:</p>
        <table border="1">
            <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Item Price</th>
                <th>Total Price</th>
            </tr>
            ${itemsHtml}
        </table>
        <p>Your delivery person is: ${delivery.deliveryPersonName}</p>
        <p>We will contact you soon!</p>
    `;
}

// Email sending function
async function sendDeliveryEmail(to, subject, htmlContent) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Correct host for Gmail
        port: 465,              // Correct SSL port for Gmail
        secure: true,           // Use SSL
        logger: true,
        debug: true,
        auth: {
            user: "bandarasumith326@gmail.com", // Your sender email address
            pass: 'enag cmin nzoy wpuk', // Your new app password here
        },
        tls: {
            rejectUnauthorized: false // Set to true in production
        }
    });

    await transporter.sendMail({
        from: 'Your Store <your-email@gmail.com>',
        to: to,
        subject: subject,
        html: htmlContent,
    });
}

// Delete a delivery
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Delivery.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ status: "Error", error: "Delivery not found" });
        }
        res.status(200).json({ status: "Success", message: "Delivery deleted" });
    } catch (err) {
        res.status(500).json({ status: "Error with deleting delivery", error: err.message });
    }
});

// Update delivery details
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedDelivery = await Delivery.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDelivery) {
            return res.status(404).json({ status: "Error", error: "Delivery not found" });
        }
        res.status(200).json({ status: "Success", message: "Delivery updated", delivery: updatedDelivery });
    } catch (err) {
        res.status(500).json({ status: "Error with updating delivery", error: err.message });
    }
});

module.exports = router;
