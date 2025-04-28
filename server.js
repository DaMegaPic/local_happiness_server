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

app.put("/api/reviews/:id", async (req, res) => {
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

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { ...value },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(updatedReview);
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Failed to update review" });
  }
});


app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Failed to delete review" });
  }
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
