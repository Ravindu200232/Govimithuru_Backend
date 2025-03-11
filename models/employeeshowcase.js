// models/employee.js
const mongoose = require('mongoose');
const Attendance = require('./attendance'); // Import the Attendance model

const EmployeeSchema = new mongoose.Schema({
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
    position: {
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
        required: false,
    },
    profileImage: {
        type: Buffer, // Store profile image as binary data
        required: false,
    },
    birthday: {
        type: Date, // Store birthday as a Date
        required: false, // Optional field
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual property to convert image buffer to base64 string
EmployeeSchema.virtual('profileImageBase64').get(function () {
    if (this.profileImage) {
        return this.profileImage.toString('base64');
    }
    return null;
});


// Middleware to create an attendance record after an employee is saved
EmployeeSchema.post('save', async function(doc) {
    console.log('Employee saved:', doc); // Check if the employee was saved successfully
    try {
        const attendanceRecord = new Attendance({
            employeeName: `${doc.firstName} ${doc.lastName}`,
            nic: doc.nic,
            status: 'Present',
            date: new Date()
        });

        await attendanceRecord.save();
        console.log('Attendance record created:', attendanceRecord);
    } catch (error) {
        console.error('Error creating attendance record:', error);
    }
});


const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
