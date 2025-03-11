const router = require("express").Router();
const GiveChecks = require("../models/GiveChecks");

// POST to create a payment receipt
router.post("/create", async (req, res) => {
    try {
        const newReceipt = new GiveChecks(req.body);
        await newReceipt.save();
        res.status(200).json({ status: "Success", message: "Payment receipt created", data: newReceipt });
    } catch (err) {
        console.error("Error creating receipt:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});

// GET all payment receipts
router.get("/", async (req, res) => {
    try {
        const receipts = await GiveChecks.find();
        res.status(200).json(receipts);
    } catch (err) {
        console.error("Error fetching receipts:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});

// GET a single receipt by ID
router.get("/:id", async (req, res) => {
    try {
        const receipt = await GiveChecks.findById(req.params.id);
        if (!receipt) {
            return res.status(404).json({ status: "Error", message: "Receipt not found" });
        }
        res.status(200).json(receipt);
    } catch (err) {
        console.error("Error fetching receipt:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});

// DELETE a receipt by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedReceipt = await GiveChecks.findByIdAndDelete(req.params.id);
        if (!deletedReceipt) {
            return res.status(404).json({ status: "Error", message: "Receipt not found" });
        }
        res.status(200).json({ status: "Success", message: "Receipt deleted" });
    } catch (err) {
        console.error("Error deleting receipt:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});

module.exports = router;
