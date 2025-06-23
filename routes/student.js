const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { studentSchema } = require("../schem2.js");
const Student = require("../models/students.js");
const studentController = require("../controller/student.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloud-Config.js");
const upload = multer({ storage });

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
    isLoggedIn,
    isAdmin,
    wrapAsync(studentController.addStudent)
  );

// delete student  -> router
router.delete("/:id", isLoggedIn, isAdmin, studentController.destroyStudent);
module.exports = router;
