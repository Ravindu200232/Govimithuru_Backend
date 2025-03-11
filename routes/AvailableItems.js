const router = require("express").Router();
const InventoryItem = require("../models/InventoryItem");
const AvailableItem = require("../models/AvailableItem");

// Aggregate Inventory Items and store in AvailableItem collection
// Aggregate Inventory Items and store in AvailableItem collection
router.post("/aggregate", async (req, res) => {
    try {
        // Fetch all inventory items
        const inventoryItems = await InventoryItem.find();

        // Use a Map to aggregate items by name
        const itemMap = new Map();

        inventoryItems.forEach((item) => {
            const key = item.name;

            if (itemMap.has(key)) {
                // If the item already exists, sum the availableItem quantity
                const existingItem = itemMap.get(key);
                existingItem.availableItem += item.quantityAvailable;
                // Update the total price based on the unit price and available quantity
                existingItem.totalPrice += item.unitPrice * item.quantityAvailable;
            } else {
                // If it's a new item, add it to the map
                itemMap.set(key, {
                    name: item.name,
                    supName: item.supName,
                    description: item.description,
                    category: item.category,
                    unit: item.unit,
                    availableItem: item.quantityAvailable,
                    unitPrice: item.unitPrice, // Include unitPrice
                    totalPrice: item.unitPrice * item.quantityAvailable // Calculate totalPrice
                });
            }
        });

        // Clear the existing AvailableItem collection before saving new data
        await AvailableItem.deleteMany({});

        // Save or update the aggregated items in the AvailableItem collection
        for (const [key, value] of itemMap) {
            await AvailableItem.findOneAndUpdate(
                { name: key },
                value,
                { upsert: true } // Create a new item if it doesn't exist, update if it does
            );
        }

        res.status(200).json({ status: "Success", message: "Aggregation and storage successful" });
    } catch (err) {
        console.error("Error during aggregation:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});


// GET all available items
router.get("/", async (req, res) => {
    try {
        const items = await AvailableItem.find();
        res.status(200).json(items);
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});

// GET a single item by ID
router.get("/:id", async (req, res) => {
    try {
        const item = await AvailableItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ status: "Error", message: "Item not found" });
        }
        res.status(200).json(item);
    } catch (err) {
        console.error("Error fetching item:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});

// UPDATE an item by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedItem = await AvailableItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ status: "Error", message: "Item not found" });
        }
        res.status(200).json({ status: "Success", message: "Item updated", data: updatedItem });
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});

// DELETE an item by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedItem = await AvailableItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ status: "Error", message: "Item not found" });
        }
        res.status(200).json({ status: "Success", message: "Item deleted" });
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).json({ status: "Error", message: err.message });
    }
});



module.exports = router;
