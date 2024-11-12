const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  marks: {
    type: Number,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  board: {
    type: String,
  },
  city: {
    type: String,
  },
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
