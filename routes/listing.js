const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controller/listing.js");

const multer = require("multer");
const { storage } = require("../cloud-Config.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body.listing);

  // Check if error exists and map error messages if it does
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//home page route
router.get("/home", listingController.renderhome);
//  <-----upload file concept from -yt channel -> Piyush Garg---->

// Upload route
router.post(
  "/upload",
  upload.single("pdf1"),
  validateListing,
  wrapAsync(listingController.uploadPdf)
);

// Delete route
router.delete("/deletePdf/:id", wrapAsync(listingController.destroyPdf));

// show route level1
router.get("/level1/show", listingController.showlevel1);

//add pdf route
router.get("/addpdf", async (req, res) => {
  res.render("home/index.ejs");
});
// this is show all pdf route on the basis of class
router.get("/class", isLoggedIn, wrapAsync(listingController.showListing));

module.exports = router;
