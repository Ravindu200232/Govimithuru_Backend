const express = require("express");
const router = express.Router();
const multer = require("multer");
const Showcase = require("../models/showcase");

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory as buffer
const upload = multer({ storage: storage });

// Add Showcase Item
router.post("/add", upload.single('image'), (req, res) => {
    const { name, category, description, unit, price, discount } = req.body;
    const image = req.file; // multer stores the file here

    if (!image) {
        return res.status(400).send("No image file uploaded");
    }

    const newShowcaseItem = new Showcase({
        name,
        image: image.buffer, // Save the image buffer directly
        category,
        description,
        unit,
        price,
        discount: discount ? Number(discount) : 0, // Handle optional discount field
    });

    newShowcaseItem.save()
        .then(() => res.json("Showcase Item Added"))
        .catch((err) => res.status(500).send(err));
});

// Get All Showcase Items
router.get("/", (req, res) => {
    Showcase.find()
        .then((showcaseItems) => res.json(showcaseItems))
        .catch((err) => res.status(500).send(err));
});

// Update Showcase Item
router.put("/update/:id", upload.single('image'), async (req, res) => {
    let itemId = req.params.id;
    const { name, category, description, unit, price, discount } = req.body;
    const image = req.file; // multer stores the file here

    const updateShowcaseItem = {
        name,
        category,
        description,
        unit,
        price,
        discount: discount ? Number(discount) : 0, // Handle optional discount field
    };

    if (image) {
        updateShowcaseItem.image = image.buffer; // Update the image if provided
    }

    await Showcase.findByIdAndUpdate(itemId, updateShowcaseItem)
        .then(() => res.status(200).send({ status: "Showcase item updated" }))
        .catch((err) => res.status(500).send({ status: "Error with updating data", error: err.message }));
});

// Delete Showcase Item
router.delete("/delete/:id", async (req, res) => {
    let itemId = req.params.id;

    await Showcase.findByIdAndDelete(itemId)
        .then(() => res.status(200).send({ status: "Showcase item deleted" }))
        .catch((err) => res.status(500).send({ status: "Error with deleting item", error: err.message }));
});

// Get One Showcase Item by ID
router.get("/get/:id", async (req, res) => {
    let itemId = req.params.id;

    await Showcase.findById(itemId)
        .then((showcaseItem) => res.status(200).send({ status: "Showcase item fetched", showcaseItem }))
        .catch((err) => res.status(500).send({ status: "Error with getting item", error: err.message }));
});

// Get all Showcase items with category 'Seeds'
router.get("/seeds", async (req, res) => {
    try {
        const showcaseItems = await Showcase.find({ category: 'Seeds' });
        res.json(showcaseItems);
    } catch (err) {
        res.status(500).send({ status: "Error with getting items", error: err.message });
    }
});

// Get all Showcase items with category 'Growth Promoters'Growthpromoters
router.get("/Growthpromoters", async (req, res) => {
    try {
        const showcaseItems = await Showcase.find({ category: 'Growth Promoters' });
        res.json(showcaseItems);
    } catch (err) {
        res.status(500).send({ status: "Error with getting items", error: err.message });
    }
});

// Get all Showcase items with category 'Remadies'
router.get("/remedies", async (req, res) => {
    try {
        const showcaseItems = await Showcase.find({ category: 'Remedies' });
        res.json(showcaseItems);
    } catch (err) {
        res.status(500).send({ status: "Error with getting items", error: err.message });
    }
});

// Get all Showcase items with category 'Orgenic Farm'
router.get("/organic-farming", async (req, res) => {
    try {
        const showcaseItems = await Showcase.find({ category: 'Organic Farming' });
        res.json(showcaseItems);
    } catch (err) {
        res.status(500).send({ status: "Error with getting items", error: err.message });
    }
});


// Get all Showcase items with category 'Equpments'
router.get("/equipments", async (req, res) => {
    try {
        const showcaseItems = await Showcase.find({ category: 'Equipment' });
        res.json(showcaseItems);
    } catch (err) {
        res.status(500).send({ status: "Error with getting items", error: err.message });
    }
});


// Get all Showcase items with category 'Fertilizer'
router.get("/fertilizers", async (req, res) => {
    try {
        const showcaseItems = await Showcase.find({ category: 'Fertilizers' });
        res.json(showcaseItems);
    } catch (err) {
        res.status(500).send({ status: "Error with getting items", error: err.message });
    }
});


// Get all Showcase items with category 'Irrigation'
router.get("/irrigation", async (req, res) => {
    try {
        const showcaseItems = await Showcase.find({ category: 'Irrigation' });
        res.json(showcaseItems);
    } catch (err) {
        res.status(500).send({ status: "Error with getting items", error: err.message });
    }
});


// Get all Showcase items with category 'Gardening'
router.get("/gardening", async (req, res) => {
    try {
        const showcaseItems = await Showcase.find({ category: 'Gardening' });
        res.json(showcaseItems);
    } catch (err) {
        res.status(500).send({ status: "Error with getting items", error: err.message });
    }
});


module.exports = router;
