const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  class: {
    type: String,
  },
  batch: {
    type: String,
  },
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
