const Student = require("../models/students");

module.exports.showStudent = async (req, res) => {
  let class10th = await Student.find({
    class: "10",
  }).sort({ marks: -1 });

  let class11th = await Student.find({
    class: "11",
  }).sort({ marks: -1 });
  let class12th = await Student.find({
    class: "12",
  }).sort({ marks: -1 });
  let classBCAth = await Student.find({
    class: "BCA",
  }).sort({ marks: -1 });

  res.render("students/allstudent.ejs", {
    class10th,
    class11th,
    class12th,
    classBCAth,
  });
};

module.exports.newStudent = (req, res) => {
  res.render("students/addStudent.ejs");
};

module.exports.addStudent = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  let student = new Student(req.body.student);
  student.image = { url, filename };
  console.log("image url", student.image.url); // Check the image URL

  await student.save();
  req.flash("success", "student added successfully!");
  res.redirect("/students");
};

module.exports.destroyStudent = async (req, res) => {
  const { id } = req.params;
  let result = await Student.findOneAndDelete({ _id: id });
  console.log(result);
  console.log("deleted student");
  req.flash("success", "student deleted successfully!");
  res.redirect("/students");
};
