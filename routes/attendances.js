const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');

// Increment attendance
router.post('/increment', async (req, res) => {
    const { employeeName, nic } = req.body;

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const attendanceRecord = await Attendance.findOne({
            employeeName,
            nic,
            date: { $gte: today, $lt: tomorrow }
        });

        if (attendanceRecord) {
            if (attendanceRecord.attendanceCount >= 1) {
                return res.status(400).json({ message: 'Attendance already marked 1 times for today.' });
            }

            // Increment the attendance count and add the current time to attendanceTimes
            attendanceRecord.attendanceCount += 1;
            attendanceRecord.attendanceTimes.push(new Date());
            await attendanceRecord.save();
            return res.status(200).json(attendanceRecord);
        }

        const newAttendance = new Attendance({
            employeeName,
            nic,
            status: 'Present',
            attendanceCount: 1,
            attendanceTimes: [new Date()],
            date: today // Ensure the date is set
        });
        await newAttendance.save();
        res.status(201).json(newAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all attendance records
router.get('/', async (req, res) => {
    try {
        const attendances = await Attendance.find();
        res.json(attendances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Delete attendance record by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAttendance = await Attendance.findByIdAndDelete(id);

        if (!deletedAttendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.status(200).json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
