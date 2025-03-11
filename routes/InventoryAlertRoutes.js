const express = require("express");
const InventoryAlert = require("../models/InventoryAlert");
const router = express.Router();

// Get all inventory alerts
router.get("/", async (req, res) => {
    try {
        const alerts = await InventoryAlert.find().populate("itemId", "name");
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Delete an inventory alert
router.delete("/:id", async (req, res) => {
    try {
        await InventoryAlert.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Alert deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;

