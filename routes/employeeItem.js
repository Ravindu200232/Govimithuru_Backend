// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Employee = require('../models/employeeshowcase'); // Ensure the correct model is required

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory as buffer
const upload = multer({ storage: storage });

// Add Employee
router.post('/add', upload.single('profileImage'), (req, res) => {
    const { firstName, lastName, email, position, department, phoneNumber, nic, drivingNic, birthday } = req.body;
    const profileImage = req.file; // multer stores the file here

    const newEmployee = new Employee({
        firstName,
        lastName,
        email,
        position,
        department,
        phoneNumber,
        nic,
        drivingNic,
        birthday: birthday ? new Date(birthday) : undefined, // Convert birthday to Date if provided
        profileImage: profileImage ? profileImage.buffer : undefined // Save the image buffer directly if present
    });

    newEmployee.save()
        .then(() => res.json('Employee Added'))
        .catch((err) => res.status(500).send(err));
});

// Get All Employees
router.get('/', (req, res) => {
    Employee.find()
        .then((employees) => res.json(employees))
        .catch((err) => res.status(500).send(err));
});

// Update Employee
router.put('/update/:id', upload.single('profileImage'), async (req, res) => {
    let employeeId = req.params.id;
    const { firstName, lastName, email, position, department, phoneNumber, nic, drivingNic, birthday } = req.body;
    const profileImage = req.file; // multer stores the file here

    const updateEmployee = {
        firstName,
        lastName,
        email,
        position,
        department,
        phoneNumber,
        nic,
        drivingNic,
        birthday: birthday ? new Date(birthday) : undefined, // Convert birthday to Date if provided
    };

    if (profileImage) {
        updateEmployee.profileImage = profileImage.buffer; // Update the image if provided
    }

    await Employee.findByIdAndUpdate(employeeId, updateEmployee)
        .then(() => res.status(200).send({ status: 'Employee updated' }))
        .catch((err) => res.status(500).send({ status: 'Error with updating data', error: err.message }));
});

// Delete Employee
router.delete('/delete/:id', async (req, res) => {
    let employeeId = req.params.id;

    await Employee.findByIdAndDelete(employeeId)
        .then(() => res.status(200).send({ status: 'Employee deleted' }))
        .catch((err) => res.status(500).send({ status: 'Error with deleting employee', error: err.message }));
});

// Get One Employee by ID
router.get('/get/:id', async (req, res) => {
    let employeeId = req.params.id;

    await Employee.findById(employeeId)
        .then((employee) => res.status(200).send({ status: 'Employee fetched', employee }))
        .catch((err) => res.status(500).send({ status: 'Error with getting employee', error: err.message }));
});

// Validate Unique Fields
router.post('/validate', async (req, res) => {
    const { email, nic, drivingNic } = req.body;

    try {
        const emailExists = await Employee.findOne({ email });
        const nicExists = await Employee.findOne({ nic });
        const drivingNicExists = await Employee.findOne({ drivingNic, position: 'Driver' });

        if (emailExists || nicExists || drivingNicExists) {
            return res.json({ isUnique: false });
        }
        
        res.json({ isUnique: true });
    } catch (err) {
        res.status(500).send({ status: 'Error with validation', error: err.message });
    }
});




// routes/employeeRoutes.js
router.get('/position/driver', async (req, res) => {
    try {
        const drivers = await Employee.find({ position: 'Driver' });
        res.json(drivers);
    } catch (err) {
        res.status(500).send(err);
    }
});



// Get Employee Summary
router.get('/summary', async (req, res) => {
    try {
        const positions = ['Driver', 'Employee Manager', 'Supply Manager', 'Staff'];
        const summary = {};

        for (const position of positions) {
            const count = await Employee.countDocuments({ position });
            summary[position] = count;
        }

        res.status(200).json(summary);
    } catch (err) {
        res.status(500).send({ status: 'Error fetching summary', error: err.message });
    }
});

module.exports = router;





module.exports = router;
