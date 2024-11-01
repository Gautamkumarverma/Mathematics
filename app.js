const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const multer = require("multer");
const Listing = require("./models/listing.js");
const Student = require("./models/students.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpresssError = require("./utils/ExpressError.js");
const Joi = require("joi");
const { listingSchema } = require("./schema.js");

const MONGO_URl = "mongodb://127.0.0.1:27017/team";

main()
  .then(() => {
    console.log("conected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URl);
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

//serve static files

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "/public")));

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Fetch listings grouped by subject for a specific class
async function fetchListingsByClass(classField) {
  const listings = await Listing.aggregate([
    { $match: { class: classField } },
    {
      $facet: {
        allMathsListings: [{ $match: { subject: "Maths" } }],
        allPhysicsListings: [{ $match: { subject: "Physics" } }],
        allChemistryListings: [{ $match: { subject: "Chemistry" } }],
        allBiologyListings: [{ $match: { subject: "Biology" } }],
      },
    },
  ]);
  return listings[0];

  //  <---------  we can replace above code with this code----------->

  // // Retrieve all listings by subject to pass to showpdf.ejs
  //   const allMathsListings = await Listing.find({
  //     class: classField,
  //     subject: "Maths",
  //   });
  //   const allPhysicsListings = await Listing.find({
  //     class: classField,
  //     subject: "Physics",
  //   });
  //   const allChemistryListings = await Listing.find({
  //     class: classField,
  //     subject: "Chemistry",
  //   });
  //   const allBiologyListings = await Listing.find({
  //     class: classField,
  //     subject: "Biology",
  //   });

  //   res.render("home/showpdf.ejs", {
  //     allMathsListings,
  //     allPhysicsListings,
  //     allChemistryListings,
  //     allBiologyListings,
  //   });
}

// Route to fetch listings by class and render showpdf.ejs
app.get(
  "/showPdf",
  wrapAsync(async (req, res) => {
    const classField = req.query.classField;

    if (!classField) {
      return res.send("Class field is required.");
    }
    const listingsByClass = await fetchListingsByClass(classField);
    res.render("home/showpdf.ejs", listingsByClass);
  })
);
//  <-----upload file concept from -yt channel -> Piyush Garg---->

// Upload route
app.post(
  "/upload",
  upload.fields([{ name: "pdf1" }, { name: "image" }]),
  wrapAsync(async (req, res) => {
    const { title, class: classField, subject } = req.body;

    // Validate required fields
    if (
      !title ||
      !classField ||
      !subject ||
      (!req.files["pdf1"] && !req.files["image"])
    ) {
      throw new ExpressError(
        400,
        "All fields (title, class, subject, and either pdf or image) are required."
      );
    }

    const pdfFile = req.files["pdf1"]
      ? `/uploads/${req.files["pdf1"][0].filename.replace(/\\/g, "/")}`
      : null;
    const imageFile = req.files["image"]
      ? `/uploads/${req.files["image"][0].filename.replace(/\\/g, "/")}`
      : null;

    const sampleListing = new Listing({
      title: title,
      class: classField,
      subject: subject,
      pdflink: pdfFile,
      imageLink: imageFile,
    });
    await sampleListing.save();

    // Redirect to /showPdf with classField as query parameter
    res.redirect(`/showPdf?classField=${encodeURIComponent(classField)}`);
  })
);

// Delete route
app.get(
  "/deletePdf/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listingToDelete = await Listing.findById(id);

    if (listingToDelete) {
      const classField = listingToDelete.class;
      await Listing.findByIdAndDelete(id);

      // Redirect to /showPdf with classField as query parameter

      res.redirect(`/showPdf?classField=${encodeURIComponent(classField)}`);
    } else {
      res.send("Listing not found.");
    }
  })
);

app.get("/listings/show", async (req, res) => {
  res.render("home/showpdflavel1.ejs");
});

// Listings and conditions routes

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    console.log("Hii Gautam kumar");

    res.render("home/index.ejs", { allListings });
  })
);

app.get("/listings/privacy", (req, res) => {
  res.render("conditions/privacy.ejs");
});
app.get("/listings/terms", (req, res) => {
  res.render("conditions/terms.ejs");
});
app.get("/", (req, res) => {
  res.render("home/index");
});

app.get("/listings/home", (req, res) => {
  console.log("Jai shree ram");
  res.render("home/homepage.ejs");
});

app.get(
  "/class",
  wrapAsync(async (req, res) => {
    const selectedClass = req.query.class;
    const pdfClass = "class" + selectedClass + "th";
    let allListings = null;

    let allMathsListings = await Listing.find({
      class: pdfClass,
      subject: "Maths",
    });
    let allPhysicsListings = await Listing.find({
      class: pdfClass,
      subject: "Physics",
    });
    let allChemistryListings = await Listing.find({
      class: pdfClass,
      subject: "Chemistry",
    });
    let allBiologyListings = await Listing.find({
      class: pdfClass,
      subject: "Biology",
    });

    res.render("home/showpdf.ejs", {
      allBiologyListings,
      allChemistryListings,
      allMathsListings,
      allPhysicsListings,
    });
  })
);

app.get(
  "/listings/students",
  wrapAsync(async (req, res) => {
    const allStudents = await Student.find({});
    console.log("Hii Gautam kumar students");
    res.render("students/allstudent.ejs", { allStudents });
  })
);

// app.get("/testlisting", async (req, res) => {
//   const sampleStudent = new Student({
//     name: "Gautam kumar",
//     image: "/uploads/images/anu.jpg",
//     batch: "2022-25",
//   });
//   await sampleStudent.save();
//   console.log("sample was saved");
//   res.send("successfully saved");
// });

app.get("*", (req, res, next) => {
  next(new ExpresssError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.render("error.ejs", { message });
  // res.status(statusCode).send(message);
});
app.listen(5000, () => {
  console.log("server is listining to port 5000");
});
