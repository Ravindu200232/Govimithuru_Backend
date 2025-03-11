const router = require("express").Router();
const OtherExpenses = require("../models/OtherExpenses");

// POST to create an expense
router.post("/create", async (req, res) => {
    try {
        const newExpense = new OtherExpenses(req.body);
        await newExpense.save();
        res.status(200).json({ status: "Success", message: "Expense created", data: newExpense });
    } catch (err) {
        console.error("Error creating expense:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});

// GET all expenses
router.get("/", async (req, res) => {
    try {
        const expenses = await OtherExpenses.find();
        res.status(200).json(expenses);
    } catch (err) {
        console.error("Error fetching expenses:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});

// DELETE an expense by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedExpense = await OtherExpenses.findByIdAndDelete(req.params.id);
        if (!deletedExpense) {
            return res.status(404).json({ status: "Error", message: "Expense not found" });
        }
        res.status(200).json({ status: "Success", message: "Expense deleted" });
    } catch (err) {
        console.error("Error deleting expense:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});

module.exports = router;
