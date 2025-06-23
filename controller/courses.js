const Course = require("../models/course");

module.exports.index = async (req, res) => {
  const courses = await Course.find({});
  res.render("courses/course", { courses });
};
