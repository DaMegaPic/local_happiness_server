const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// In-memory reviews array
const reviews = [
  {
    id: 1,
    title: "Great Work!",
    rating: 5,
    code: "ABC123",
    description: "They did a fantastic job with my kitchen.",
    image: "kitchen.jpg",
    date: "1/1/00",
    reviewer: "Colson"
  },
  {
    id: 2,
    title: "Very Professional",
    rating: 3,
    code: "XYZ789",
    description: "Professional and friendly team.",
    image: "bathroom.jpg",
    date: "1/1/00",
    reviewer: "Colson"
  }
];

// GET route: return all reviews
app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});

// POST route: validate and add a new review
app.post("/api/reviews", (req, res) => {
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

  const newReview = {
    ...value,
    id: reviews.length + 1,
    date: new Date().toLocaleDateString()
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

// Serve home page (optional if using React separately)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
