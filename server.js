const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const reviews = [
  {
    id: 1,
    title: "Great Work!",
    rating: "5",
    code: "ABC123",
    description: "They did a fantastic job with my kitchen.",
    image: "kitchen.jpg",
    date: "1/1/00",
    reviewer: "Colson"
  },
  {
    id: 2,
    title: "Very Professional",
    rating: "3",
    code: "XYZ789",
    description: "Professional and friendly team.",
    image: "bathroom.jpg",
    date: "1/1/00",
    reviewer: "Colson"
  }
];

// API route to get reviews
app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
