const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  code: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  reviewer: { type: String, required: true }
});

const Review = mongoose.model('Review', reviewSchema, "Reviews");

module.exports = Review;