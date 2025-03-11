const express = require('express');
const router = express.Router();
const Driver = require('../models/driver'); // Ensure the correct model is required

// Helper function for email validation
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// Add Driver
router.post('/add', (req, res) => {
    const { firstName, lastName, email, department, phoneNumber, nic, drivingNic, birthday,status } = req.body;

    if (!isValidEmail(email)) {
        return res.status(400).send({ status: 'Error', message: 'Invalid email format.' });
    }

    const newDriver = new Driver({
        firstName,
        lastName,
        email,
        department,
        phoneNumber,
        nic,
        drivingNic,
        status,
        birthday: birthday ? new Date(birthday) : undefined,
    });

    newDriver.save()
        .then(() => res.json('Driver Added'))
        .catch((err) => res.status(500).send(err));
});

// Get All Drivers
router.get('/', (req, res) => {
    Driver.find()
        .then((drivers) => res.json(drivers))
        .catch((err) => res.status(500).send(err));
});

// Update Driver
router.put('/update/:id', async (req, res) => {
    const driverId = req.params.id;
    const { status } = req.body;

    try {
        const updatedDriver = await Driver.findByIdAndUpdate(driverId, { status }, { new: true });
        if (!updatedDriver) {
            return res.status(404).send({ status: 'Error', message: 'Driver not found.' });
        }
        res.status(200).send({ status: 'Driver updated' });
    } catch (err) {
        res.status(500).send({ status: 'Error with updating data', error: err.message });
    }
});

// Delete Driver
router.delete('/delete/:id', async (req, res) => {
    const driverId = req.params.id;

    try {
        await Driver.findByIdAndDelete(driverId);
        res.status(200).send({ status: 'Driver deleted' });
    } catch (err) {
        res.status(500).send({ status: 'Error with deleting driver', error: err.message });
    }
});

// Delete All Drivers
router.delete('/deleteAll', async (req, res) => {
    try {
        await Driver.deleteMany({});
        res.status(200).send({ status: 'All drivers deleted' });
    } catch (err) {
        res.status(500).send({ status: 'Error with deleting drivers', error: err.message });
    }
});

// Validate Unique Fields
router.post('/validate', async (req, res) => {
    const { email, nic, drivingNic } = req.body;

    try {
        const emailExists = await Driver.findOne({ email });
        const nicExists = await Driver.findOne({ nic });
        const drivingNicExists = await Driver.findOne({ drivingNic });

        if (emailExists || nicExists || drivingNicExists) {
            return res.json({ isUnique: false });
        }
        
        res.json({ isUnique: true });
    } catch (err) {
        res.status(500).send({ status: 'Error with validation', error: err.message });
    }
});

// Get Available Drivers
router.get('/status/available', (req, res) => {
    Driver.find({ status: 'available' })
        .then(drivers => res.json(drivers))
        .catch(err => res.status(500).send(err));
});


module.exports = router;
