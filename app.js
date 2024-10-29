const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const multer = require("multer");
const Listing = require("./models/listing.js");
const Student = require("./models/students.js");
const { Console } = require("console");
const MONGO_URl = "mongodb://127.0.0.1:27017/team";

main()
  .then(() => {
    console.log("conected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URl);
}
app.use(express.urlencoded({ extended: true }));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "/public")));

//  <-----upload file concept from -yt channel -> Piyush Garg---->
app.post(
  "/upload",
  upload.fields([{ name: "pdf1" }, { name: "image" }]),
  (req, res) => {
    console.log(req.body);
    console.log(req.files); // Logs the uploaded files for pdf1 and image
    // Your code to handle file paths and save to database goes here
    const { title, class: classField, subject } = req.body;
    console.log("title ", title);
    console.log("class ", classField);
    console.log("subject ", subject);

    // const pdfFile = req.files["pdf1"] ? req.files["pdf1"][0] : null;
    // const imageFile = req.files["image"] ? req.files["image"][0] : null;
    // <-----------changes are here------------------------------>
    const pdfFile = req.files["pdf1"]
      ? `/uploads/${req.files["pdf1"][0].filename.replace(/\\/g, "/")}`
      : null;
    const imageFile = req.files["image"]
      ? `/uploads/${req.files["image"][0].filename.replace(/\\/g, "/")}`
      : null;

    console.log(pdfFile); //see printing to check the link
    const sampleListing = new Listing({
      title: title,

      class: classField,
      subject: subject,
      pdflink: pdfFile ? pdfFile : null,
      imageLink: imageFile ? imageFile : null,
    });
    sampleListing.save();

    res.redirect("/listings");
  }
);
app.get("/listings/show", async (req, res) => {
  res.render("home/showpdflavel1.ejs");
});

app.get("/class", async (req, res) => {
  const selectedClass = req.query.class;
  const pdfClass = "class" + selectedClass + "th";
  let allListings = null;
  // Based on the selected class, fetch and render the appropriate data
  switch (selectedClass) {
    case "10":
      // Fetch data for Class 10
      console.log("class 10 me yaya");
      allListings = await Listing.find({ class: pdfClass });
      res.render("home/showpdf.ejs", { allListings });
      break;
    case "11":
      console.log("class 11 me yaya");
      allListings = await Listing.find({ class: pdfClass });
      res.render("home/showpdf.ejs", { allListings });
      break;
    case "12":
      // Fetch data for Class 12

      allListings = await Listing.find({ class: pdfClass });
      res.render("home/showpdf.ejs", { allListings });
      break;
    case "bca":
      // Fetch data for BCA
      console.log("class BCA me yaya");
      allListings = await Listing.find({ class: pdfClass });
      res.render("home/showpdf.ejs", { allListings });
      break;
    default:
      res.status(404).send("Class not found");
  }
});

app.get("/", (req, res) => {
  res.render("home/index");
});

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  console.log("Hii Gautam kumar");

  res.render("home/index.ejs", { allListings });
});
app.get("/listings/home", (req, res) => {
  console.log("Jai shree ram");
  res.render("home/homepage.ejs");
});
app.get("/listings/students", async (req, res) => {
  const allStudents = await Student.find({});
  console.log("Hii Gautam kumar students");
  res.render("students/allstudent.ejs", { allStudents });
});

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

app.listen(5000, () => {
  console.log("server is listining to port 8080");
});
