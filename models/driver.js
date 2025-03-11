const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    nic: {
        type: String,
        required: true,
    },
    drivingNic: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date, // Store birthday as a Date
        required: false,
    },
    status: {
        type: String,
        required: false,
        default: "unavailable",
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;
