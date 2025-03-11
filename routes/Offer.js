const express = require('express');
const router = express.Router();
const multer = require('multer');
const Offer = require('../models/Offer'); // Ensure the correct model is required

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory as buffer
const upload = multer({ storage: storage });

// Add Offer
router.post('/add', upload.single('img'), (req, res) => {
    const { title, description, link } = req.body;
    const img = req.file; // multer stores the file here

    const newOffer = new Offer({
        title,
        description,
        link,
        img: img ? img.buffer : undefined, // Save the image buffer directly if present
    });

    newOffer.save()
        .then(() => res.json('Offer Added'))
        .catch((err) => res.status(500).send(err));
});

// Get All Offers
// Get All Offers
router.get('/', (req, res) => {
    Offer.find()
      .then((offers) => {
        const offersWithBase64Images = offers.map((offer) => ({
          ...offer._doc,
          img: offer.img ? `data:image/jpeg;base64,${offer.img.toString('base64')}` : null, // Convert buffer to base64 string
        }));
        res.json(offersWithBase64Images);
      })
      .catch((err) => res.status(500).send(err));
  });
  

// Update Offer
router.put('/update/:id', upload.single('img'), async (req, res) => {
    let offerId = req.params.id;
    const { title, description, link } = req.body;
    const img = req.file; // multer stores the file here

    const updateOffer = {
        title,
        description,
        link,
    };

    if (img) {
        updateOffer.img = img.buffer; // Update the image if provided
    }

    await Offer.findByIdAndUpdate(offerId, updateOffer)
        .then(() => res.status(200).send({ status: 'Offer updated' }))
        .catch((err) => res.status(500).send({ status: 'Error with updating data', error: err.message }));
});

// Delete Offer
router.delete('/delete/:id', async (req, res) => {
    let offerId = req.params.id;

    await Offer.findByIdAndDelete(offerId)
        .then(() => res.status(200).send({ status: 'Offer deleted' }))
        .catch((err) => res.status(500).send({ status: 'Error with deleting offer', error: err.message }));
});

// Get One Offer by ID
router.get('/get/:id', async (req, res) => {
    let offerId = req.params.id;

    await Offer.findById(offerId)
        .then((offer) => res.status(200).send({ status: 'Offer fetched', offer }))
        .catch((err) => res.status(500).send({ status: 'Error with getting offer', error: err.message }));
});

// Validate Unique Fields (if necessary)
router.post('/validate', async (req, res) => {
    const { title } = req.body;

    try {
        const titleExists = await Offer.findOne({ title });

        if (titleExists) {
            return res.json({ isUnique: false });
        }

        res.json({ isUnique: true });
    } catch (err) {
        res.status(500).send({ status: 'Error with validation', error: err.message });
    }
});

module.exports = router;
