const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const {} = require("../middleware");
const courseController = require("../controller/courses.js");
const { courseSchema } = require("../schema.js");

const validateCourse = (req, res, next) => {
  console.log(req.body);

  const { error } = courseSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.post("/", validateCourse, async (req, res) => {
  const { course } = req.body;

  // Convert YouTube URL
  if (course.videoUrl && course.videoUrl.includes("watch?v=")) {
    const videoId = course.videoUrl.split("watch?v=")[1];
    course.videoUrl = `https://www.youtube.com/embed/${videoId}`;

    // Set default thumbnail if none provided
    if (!course.thumbnail || course.thumbnail.trim() === "") {
      course.thumbnail = `https://img.youtube.com/vi/${videoId}/default.jpg`;
    }
  }

  // Convert labels string to array
  if (typeof course.labels === "string") {
    course.labels = course.labels.split(",").map((label) => label.trim());
  }

  const newCourse = new Course(course);
  await newCourse.save();

  res.redirect("/courses");
});
// Show all courses
router.get("/", async (req, res) => {
  const courses = await Course.find({});
  res.render("courses/course", { courses });
});

// Form to add a new course
router.get("/new", (req, res) => {
  res.render("courses/addcourse");
});

router.get("/deleteall", isLoggedIn, isAdmin, async (req, res) => {
  await Course.deleteMany({});
  res.send("All courses deleted.");
});

// DELETE one course by ID
router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await Course.findByIdAndDelete(id);
    res.redirect("/courses");
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).send("Failed to delete course");
  }
});

module.exports = router;
