const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { studentSchema } = require("../schem2.js");
const Student = require("../models/students.js");
const studentController = require("../controller/student.js");

const multer = require("multer");
const { imageStorage } = require("../cloud_Config.js");
const upload = multer({ imageStorage });

const validateStudent = (req, res, next) => {
  const { error } = studentSchema.validate(req.body);

  if (error) {
    let { errMsg } = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
// show student router on the basis of class
router.get("/", wrapAsync(studentController.showStudent));

// new student -> router
// Add Student ->router
router
  .route("/add")
  .get(studentController.newStudent)
  .post(
    upload.single("student[image]"),
    validateStudent,
    wrapAsync(studentController.addStudent)
  );

// delete student  -> router
router.delete("/:id", studentController.destroyStudent);
module.exports = router;
