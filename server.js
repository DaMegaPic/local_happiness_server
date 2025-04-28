const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const app = express();
const mongoose = require('mongoose');
const Review = require('./models/Review');

mongoose.connect("mongodb+srv://localhappinessinbox:Colsoncarey!23@reviews.uv2cxpk.mongodb.net/?retryWrites=true&w=majority&appName=reviews")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.put("/api/reviews/:id", (req, res) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    rating: Joi.number().min(1).max(5).required(),
    code: Joi.string().required(),
    description: Joi.string().min(10).required(),
    image: Joi.string().required(),
    reviewer: Joi.string().required()
  });

  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const reviewId = req.params.id;
  const index = reviews.findIndex(r => r._id === reviewId);
  if (index === -1) return res.status(404).json({ error: "Review not found" });

  const updatedReview = {
    ...reviews[index],
    ...value
  };

  reviews[index] = updatedReview;
  res.status(200).json(updatedReview);
});

app.delete("/api/reviews/:id", (req, res) => {
  const reviewId = req.params.id;
  const index = reviews.findIndex(r => r._id === reviewId);
  if (index === -1) return res.status(404).json({ error: "Review not found" });

  reviews.splice(index, 1);
  res.status(200).json({ message: "Review deleted" });
});



// GET route: return all reviews
app.get("/api/reviews", async (req, res) => {
  res.json(reviews);
});

// POST route: validate and add a new review
app.post("/api/reviews", async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    rating: Joi.number().min(1).max(5).required(),
    code: Joi.string().required(),
    description: Joi.string().min(10).required(),
    image: Joi.string().required(),
    reviewer: Joi.string().required()
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newReview = new Review({
      ...value,
      date: new Date().toLocaleDateString() // generate today's date automatically
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ error: "Failed to save review" });
  }
});

app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
