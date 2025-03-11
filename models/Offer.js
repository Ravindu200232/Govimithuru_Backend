// models/offer.js
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    img: { type: Buffer, required: true }, // Store image as binary data
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual property to convert image buffer to base64 string
offerSchema.virtual('imgBase64').get(function () {
    return this.img ? this.img.toString('base64') : null;
});

module.exports = mongoose.model('Offer', offerSchema);
