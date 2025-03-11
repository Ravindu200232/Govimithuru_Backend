const express = require('express');
const router = express.Router();
const Review = require('../models/Review');


// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).send({ status: "Error fetching reviews", error: err.message });
  }
});

// Get reviews for an item
router.get('/item/:itemId', async (req, res) => {
  try {
    const reviews = await Review.find({ itemId: req.params.itemId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).send({ status: "Error fetching reviews", error: err.message });
  }
});

// Add a review
router.post('/add', async (req, res) => {
  const { itemId, reviewerName, reviewText, rating } = req.body;

  if (!itemId || !reviewerName || !reviewText || !rating) {
    return res.status(400).send({ status: "Error adding review", error: "Missing required fields" });
  }

  try {
    const newReview = new Review({ itemId, reviewerName, reviewText, rating });
    await newReview.save();
    res.status(200).json("Review added successfully");
  } catch (err) {
    res.status(500).send({ status: "Error adding review", error: err.message });
  }
});

module.exports = router;
