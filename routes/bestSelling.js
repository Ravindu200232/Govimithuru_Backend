const express = require('express');
const router = express.Router();
const multer = require('multer');
const BestSelling = require('../models/bestSelling');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add Best Selling
router.post('/add', upload.single('img'), (req, res) => {
    const { title, description, link } = req.body;
    const img = req.file;

    const newBestSelling = new BestSelling({
        title,
        description,
        link,
        img: img ? img.buffer : undefined,
    });

    newBestSelling.save()
        .then(() => res.json('Best Selling Added'))
        .catch((err) => res.status(500).send(err));
});

// Get All Best Selling Items
router.get('/', (req, res) => {
    BestSelling.find()
        .then((items) => {
            const itemsWithBase64Images = items.map((item) => ({
                ...item._doc,
                img: item.img ? `data:image/jpeg;base64,${item.img.toString('base64')}` : null,
            }));
            res.json(itemsWithBase64Images);
        })
        .catch((err) => res.status(500).send(err));
});

// Update Best Selling Item
router.put('/update/:id', upload.single('img'), async (req, res) => {
    const itemId = req.params.id;
    const { title, description, link } = req.body;
    const img = req.file;

    const updateItem = {
        title,
        description,
        link,
    };

    if (img) {
        updateItem.img = img.buffer;
    }

    await BestSelling.findByIdAndUpdate(itemId, updateItem)
        .then(() => res.status(200).send({ status: 'Best Selling item updated' }))
        .catch((err) => res.status(500).send({ status: 'Error with updating data', error: err.message }));
});

// Delete Best Selling Item
router.delete('/delete/:id', async (req, res) => {
    const itemId = req.params.id;

    await BestSelling.findByIdAndDelete(itemId)
        .then(() => res.status(200).send({ status: 'Best Selling item deleted' }))
        .catch((err) => res.status(500).send({ status: 'Error with deleting item', error: err.message }));
});

// Get One Best Selling Item by ID
router.get('/get/:id', async (req, res) => {
    const itemId = req.params.id;

    await BestSelling.findById(itemId)
        .then((item) => res.status(200).send({ status: 'Best Selling item fetched', item }))
        .catch((err) => res.status(500).send({ status: 'Error with getting item', error: err.message }));
});

// Validate Unique Fields (if necessary)
router.post('/validate', async (req, res) => {
    const { title } = req.body;

    try {
        const titleExists = await BestSelling.findOne({ title });

        if (titleExists) {
            return res.json({ isUnique: false });
        }

        res.json({ isUnique: true });
    } catch (err) {
        res.status(500).send({ status: 'Error with validation', error: err.message });
    }
});

module.exports = router;
