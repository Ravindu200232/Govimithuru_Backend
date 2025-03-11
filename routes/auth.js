const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Google authentication routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/Home',
    failureRedirect: 'http://localhost:3000/login'
}));

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(403).json({ message: 'Not authenticated' });
    }
});

// Sign Up
router.post('/signup', async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    try {
        const newUser = new User({ firstname, lastname, username, email, password });
        await newUser.save();
        res.status(201).send("User created successfully!");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send("Invalid credentials");
        }
        // Include username in the response
        res.json({  username: user.username });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Logout endpoint
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('http://localhost:3000');
    });
});

module.exports = router;
