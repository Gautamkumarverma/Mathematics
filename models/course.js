const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String,
  thumbnail: String, 
  price: Number,
  discount: String,
  labels: [String], 
});

module.exports = mongoose.model("Course", courseSchema);
