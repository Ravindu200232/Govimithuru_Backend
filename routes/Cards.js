const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const AvailableItem = require('../models/AvailableItem');

// Get all cart items
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).send({ status: "Error with fetching cart items", error: err.message });
  }
});


// Add Card Item
router.post('/add', async (req, res) => {
    const { itemNamec, categoryc, pricec, quantityc, imagec } = req.body; // Include imagec

    // Validate that required fields are provided
    if (!itemNamec || !categoryc || !pricec || !quantityc || !imagec) {
        return res.status(400).send({ status: "Error with adding card item", error: "Missing required fields" });
    }

    try {
        // Find the corresponding available item
        const availableItem = await AvailableItem.findOne({ name: itemNamec });

        if (!availableItem) {
            return res.status(404).send({ status: "Error with adding card item", error: "Available item not found" });
        }

        // Create a new card item with available count and image
        const newCard = new Card({
            itemNamec,
            categoryc,
            pricec,
            quantityc, 
            available: availableItem.availableItem,  // Add available count
            imagec // Save the image in the card database
        });

        // Save the new card item
        await newCard.save();

        res.status(200).json("Card Item Added with Available Count and Image");
    } catch (err) {
        res.status(500).send({ status: "Error with adding card item", error: err.message });
    }
});

// Update Card Item
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { quantityc } = req.body;

    try {
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).send({ status: "Error with updating card item", error: "Card item not found" });
        }

        // Update the quantity
        card.quantityc = quantityc;
        await card.save();

        res.status(200).json("Card Item Updated");
    } catch (err) {
        res.status(500).send({ status: "Error with updating card item", error: err.message });
    }
});

// Delete Card Item
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const card = await Card.findByIdAndDelete(id);
        if (!card) {
            return res.status(404).send({ status: "Error with deleting card item", error: "Card item not found" });
        }

        res.status(200).json("Card Item Deleted");
    } catch (err) {
        res.status(500).send({ status: "Error with deleting card item", error: err.message });
    }
});

module.exports = router;
