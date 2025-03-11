const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// User schema definition
const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true }, // Optional for Google sign-in
    displayName: String, // Optional, for Google sign-in
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    username: { type: String, required: false, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    image: String,
});

// Pre-save hook to hash the password and send a welcome email
userSchema.pre("save", async function (next) {
    try {
        // Check for existing email or username
        const existingUser = await User.findOne({
            $or: [{ email: this.email }, { username: this.username }],
        });

        if (existingUser) {
            const errorMessage = existingUser.email === this.email 
                ? "Email already exists." 
                : "Username already exists.";
            return next(new Error(errorMessage));
        }

        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }

        if (this.isNew) { // Check if it's a new user
            const emailContent = createWelcomeEmailContent(this);
            await sendWelcomeEmail(this.email, "Welcome to Govimithuru Store", emailContent);
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Function to create the HTML content for the welcome email
function createWelcomeEmailContent(user) {
    return `
        <h1>Welcome, ${user.displayName || `${user.firstname} ${user.lastname}` || user.email}!</h1>
        <p>Thank you for signing up with Govimithuru Store.</p>
        <p>We're excited to have you on board!</p>
        <p>If you have any questions, feel free to reach out to us.</p>
        <p>Best regards,<br>Govimithuru Store Team</p>
    `;
}

// Function to send the welcome email
async function sendWelcomeEmail(to, subject, htmlContent) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "bandarasumith326@gmail.com", // Your sender email address
                pass: "enag cmin nzoy wpuk", // Your new app password here
            },
            tls: {
                rejectUnauthorized: false, // Set to true in production
            },
        });

        const info = await transporter.sendMail({
            from: 'Govimithuru Store <sumithb919@gmail.com>',
            to: to,
            subject: subject,
            html: htmlContent,
        });

        console.log("Welcome email sent: " + info.messageId);
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
}

// Method to compare passwords
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
