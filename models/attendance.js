const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'], // Possible attendance statuses
        required: true,
    },
    date: {
        type: Date,
        default: Date.now, // Automatically set to the current date
        required: true,
    },
    nic: {
        type: String,
        required: true,
    },
    attendanceCount: {
        type: Number,
        default: 0,  // Default attendance count
        required: false,
    },
    attendanceTimes: {
        type: [Date], // Array to store attendance times
        default: []   // Default to an empty array
    }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;
