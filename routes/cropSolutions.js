const express = require('express');
const router = express.Router();
const multer = require('multer');
const CropSolution = require('../models/cropSolution');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add Crop Solution
router.post('/add', upload.single('img'), (req, res) => {
    const { title, description, link } = req.body;
    const img = req.file;

    const newCropSolution = new CropSolution({
        title,
        description,
        link,
        img: img ? img.buffer : undefined,
    });

    newCropSolution.save()
        .then(() => res.json('Crop Solution Added'))
        .catch((err) => res.status(500).send(err));
});

// Get All Crop Solutions
router.get('/', (req, res) => {
    CropSolution.find()
        .then((cropSolutions) => {
            const cropSolutionsWithBase64Images = cropSolutions.map((solution) => ({
                ...solution._doc,
                img: solution.img ? `data:image/jpeg;base64,${solution.img.toString('base64')}` : null,
            }));
            res.json(cropSolutionsWithBase64Images);
        })
        .catch((err) => res.status(500).send(err));
});

// Update Crop Solution
router.put('/update/:id', upload.single('img'), async (req, res) => {
    const solutionId = req.params.id;
    const { title, description, link } = req.body;
    const img = req.file;

    const updateCropSolution = {
        title,
        description,
        link,
    };

    if (img) {
        updateCropSolution.img = img.buffer;
    }

    await CropSolution.findByIdAndUpdate(solutionId, updateCropSolution)
        .then(() => res.status(200).send({ status: 'Crop Solution updated' }))
        .catch((err) => res.status(500).send({ status: 'Error with updating data', error: err.message }));
});

// Delete Crop Solution
router.delete('/delete/:id', async (req, res) => {
    const solutionId = req.params.id;

    await CropSolution.findByIdAndDelete(solutionId)
        .then(() => res.status(200).send({ status: 'Crop Solution deleted' }))
        .catch((err) => res.status(500).send({ status: 'Error with deleting solution', error: err.message }));
});

// Get One Crop Solution by ID
router.get('/get/:id', async (req, res) => {
    const solutionId = req.params.id;

    await CropSolution.findById(solutionId)
        .then((solution) => res.status(200).send({ status: 'Crop Solution fetched', solution }))
        .catch((err) => res.status(500).send({ status: 'Error with getting solution', error: err.message }));
});

// Validate Unique Fields (if necessary)
router.post('/validate', async (req, res) => {
    const { title } = req.body;

    try {
        const titleExists = await CropSolution.findOne({ title });

        if (titleExists) {
            return res.json({ isUnique: false });
        }

        res.json({ isUnique: true });
    } catch (err) {
        res.status(500).send({ status: 'Error with validation', error: err.message });
    }
});

module.exports = router;
