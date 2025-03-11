const router = require("express").Router();
let InventoryItem = require("../models/InventoryItem");

// Add Inventory Item
router.route("/add").post((req, res) => {
    const { name, supName, description, category, unit, quantityAvailable, unitPrice, supplyDate, mfdDate, expireDate } = req.body;

    // Calculate totalPrice
    const totalPrice = unitPrice * quantityAvailable;

    const newInventoryItem = new InventoryItem({
        name,
        supName,
        description,
        category,
        unit,
        quantityAvailable,
        unitPrice,
        totalPrice, // Include totalPrice
        mfdDate: new Date(mfdDate),
        expireDate: new Date(expireDate),
        supplyDate: new Date(supplyDate) // Store only the date part
    });

    newInventoryItem.save()
        .then(() => res.json("InventoryItem Added"))
        .catch((err) => console.log(err));
});

// Get All Inventory Items
router.route("/").get((req, res) => {
    InventoryItem.find()
        .then((inventoryitems) => res.json(inventoryitems))
        .catch((err) => console.log(err));
});

// Update Inventory Item
router.route("/update/:id").put(async (req, res) => {
    let itemId = req.params.id;
    const { name, supName, description, category, unit, quantityAvailable, unitPrice, supplyDate } = req.body;

    // Calculate totalPrice
    const totalPrice = unitPrice * quantityAvailable;

    const updateInventoryItem = {
        name,
        supName,
        description,
        category,
        unit,
        quantityAvailable,
        unitPrice,
        totalPrice, // Include totalPrice
        supplyDate: new Date(supplyDate) // Store only the date part
    };

    await InventoryItem.findByIdAndUpdate(itemId, updateInventoryItem)
        .then(() => res.status(200).send({ status: "Item updated" }))
        .catch((err) => res.status(500).send({ status: "Error with updating data", error: err.message }));
});

// Delete Inventory Item
router.route("/delete/:id").delete(async (req, res) => {
    let itemId = req.params.id;

    await InventoryItem.findByIdAndDelete(itemId)
        .then(() => res.status(200).send({ status: "Item deleted" }))
        .catch((err) => res.status(500).send({ status: "Error with deleting item", error: err.message }));
});

// Get One Inventory Item by ID
router.route("/get/:id").get(async (req, res) => {
    let itemId = req.params.id;

    await InventoryItem.findById(itemId)
        .then((inventoryitems) => res.status(200).send({ status: "Item fetched", inventoryitems }))
        .catch((err) => res.status(500).send({ status: "Error with getting item", error: err.message }));
});

module.exports = router;
