const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Order schema definition
const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    productDetails: [
        {
            itemName: { type: String, required: true },
            quantitySold: { type: Number, required: true },
            itemPrice: { type: Number, required: true },
            totalPrice: { type: Number, required: true }
        }
    ],
    saleDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    paymentType: { type: String, enum: ['cash', 'online'], required: true }
});

// Pre-save hook to send email when an order is created
orderSchema.pre('save', async function (next) {
    if (this.isNew) { // Check if it's a new order
        const emailContent = createOrderEmailContent(this);
        await sendOrderEmail(this.email, 'Order Processing', emailContent);
    }
    next();
});

// Function to create the HTML content for the order email
// Function to create the HTML content for the order email
function createOrderEmailContent(order) {
    let itemsHtml = '';
    order.productDetails.forEach(item => {
        itemsHtml += `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.itemName}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantitySold}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rs:${item.itemPrice.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rs:${item.totalPrice.toFixed(2)}</td>
            </tr>
        `;
    });

    const totalAmount = order.productDetails.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2);

    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="color: #4CAF50;">Order Confirmation</h1>
            <p>Thank you for your order, <strong>${order.customerName}</strong>!</p>
            <p>Your order details:</p>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 8px;">Item Name</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Quantity Sold</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Item Price</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Total Amount:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Rs:${totalAmount}</strong></td>
                    </tr>
                </tfoot>
            </table>
            <p style="margin-top: 20px;">We will notify you once your order is shipped.</p>
            <p style="color: #888;">If you have any questions, feel free to contact us at <a href="mailto:support@govimithurustore.com">support@govimithurustore.com</a>.</p>
        </div>
    `;
}


// Function to send the order email
async function sendOrderEmail(to, subject, htmlContent) {
    try {
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

        const info = await transporter.sendMail({
            from: 'Govimithuru Store <sumithb919@gmail.com>',
            to: to,
            subject: subject,
            html: htmlContent,
        });

        console.log("Order email sent: " + info.messageId);
    } catch (error) {
        console.error("Error sending order email:", error);
    }
}

// Export the Order model
module.exports = mongoose.model('Order', orderSchema);
