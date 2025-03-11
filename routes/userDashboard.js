const express = require("express");
const router = express.Router();
const User = require("../models/User");  // Ensure the correct import

// Add User
router.post("/add", (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;

    const newUser = new User({
        firstname,
        lastname,
        username,
        email,
        password,
    });

    newUser.save()
        .then(() => res.json("User Added"))
        .catch((err) => res.status(500).send({ status: "Error with adding user", error: err.message }));
});

// Get All Users
router.get("/", (req, res) => {
    User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).send({ status: "Error with getting users", error: err.message }));
});

// Update User
router.put("/update/:id", async (req, res) => {
    const userId = req.params.id;
    const { firstname, lastname, username, email, password } = req.body;

    const updateUser = {
        firstname,
        lastname,
        username,
        email,
        password, // Note: Password should be hashed if being updated
    };

    await User.findByIdAndUpdate(userId, updateUser)
        .then(() => res.status(200).send({ status: "User updated" }))
        .catch((err) => res.status(500).send({ status: "Error with updating user", error: err.message }));
});

// Delete User
router.delete("/delete/:id", async (req, res) => {
    const userId = req.params.id;

    await User.findByIdAndDelete(userId)
        .then(() => res.status(200).send({ status: "User deleted" }))
        .catch((err) => res.status(500).send({ status: "Error with deleting user", error: err.message }));
});

// Get One User by ID
router.get("/get/:id", async (req, res) => {
    const userId = req.params.id;

    await User.findById(userId)
        .then((user) => res.status(200).send({ status: "User fetched", user }))
        .catch((err) => res.status(500).send({ status: "Error with getting user", error: err.message }));
});

// Get One User by Username
router.get("/getByUsername/:username", async (req, res) => {
    const username = req.params.username;

    await User.findOne({ username })
        .then((user) => {
            if (user) {
                res.status(200).send({ status: "User fetched", user });
            } else {
                res.status(404).send({ status: "User not found" });
            }
        })
        .catch((err) => res.status(500).send({ status: "Error with getting user", error: err.message }));
});


module.exports = router;
