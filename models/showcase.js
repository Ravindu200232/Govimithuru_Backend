const mongoose = require("mongoose");

const ShowcaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer, // Store image data as a binary buffer
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    unit: {
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number, // Discount as a percentage (e.g., 10 for 10%)
        default: 0,
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual property to convert image buffer to base64 string
ShowcaseSchema.virtual('imageBase64').get(function () {
    if (this.image) {
        return this.image.toString('base64');
    }
    return null;
});

const Showcase = mongoose.model("Showcase", ShowcaseSchema);

module.exports = Showcase;
