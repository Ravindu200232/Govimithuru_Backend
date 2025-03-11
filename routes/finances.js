const router = require("express").Router();
let Finance = require("../models/finance");

// Add Finance Record
router.route("/add").post((req, res) => {
    const { customerName, itemId, itemName, itemPrice, date, quantity, fullAmount, paymentOption, paidPrice, debt } = req.body;

    const newFinanceRecord = new Finance({
        customerName,
        itemId,  // Assuming itemId is a number here
        itemName,
        itemPrice,
        date: new Date(date),  // Store only the date part
        quantity,
        fullAmount,
        paymentOption,
        paidPrice,
        debt
    });

    newFinanceRecord.save()
        .then(() => res.json("Finance Record Added"))
        .catch((err) => console.log(err));
});

// Get All Finance Records
router.route("/").get((req, res) => {
    Finance.find()
        .then((finances) => res.json(finances))
        .catch((err) => console.log(err));
});

// Update Finance Record
// http://localhost:7070/finance/update/:id
router.route("/update/:id").put(async (req, res) => {
    let recordId = req.params.id;
    const { customerName, itemId, itemName, itemPrice, date, quantity, fullAmount, paymentOption, paidPrice, debt } = req.body;

    const updateFinanceRecord = {
        customerName,
        itemId,  // Assuming itemId is a number here
        itemName,
        itemPrice,
        date: new Date(date),  // Store only the date part
        quantity,
        fullAmount,
        paymentOption,
        paidPrice,
        debt
    };

    await Finance.findByIdAndUpdate(recordId, updateFinanceRecord, { new: true })
        .then(() => res.status(200).send({ status: "Record updated" }))
        .catch((err) => res.status(500).send({ status: "Error with updating data", error: err.message }));
});

// Delete Finance Record
// http://localhost:7070/finance/delete/:id
router.route("/delete/:id").delete(async (req, res) => {
    let recordId = req.params.id;

    await Finance.findByIdAndDelete(recordId)
        .then(() => res.status(200).send({ status: "Record deleted" }))
        .catch((err) => res.status(500).send({ status: "Error with deleting record", error: err.message }));
});

// Get One Finance Record by ID
router.route("/get/:id").get(async (req, res) => {
    let recordId = req.params.id;

    await Finance.findById(recordId)
        .then((finance) => res.status(200).send({ status: "Record fetched", finance }))
        .catch((err) => res.status(500).send({ status: "Error with getting record", error: err.message }));
});

module.exports = router;
