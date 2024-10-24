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
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "/public")));

// app.post("/upload", upload.single("pdf1"), (req, res) => {
//   const title = req.file.filename;
//   const link = req.file.path;
//   const sampleListing = new Listing({
//     title: title,
//     pdflink: link,
//   });
//   sampleListing.save();
//   res.redirect("/listings");
// });

// app.get("/", (req, res) => {
//   res.render("home/index");
// });

// app.get("/listings", async (req, res) => {
//   const allListings = await Listing.find({});
//   console.log("Hii Gautam kumar");

//   res.render("home/index.ejs", { allListings });
// });
// app.get("/listings/home", (req, res) => {
//   console.log("Jai shree ram");
//   res.render("home/alldocument.ejs");
// });
app.get("/listings/students", async (req, res) => {
  const allStudents = await Student.find({});
  console.log("Hii Gautam kumar students");
  res.render("students/allstudent.ejs", { allStudents });
});

app.get("/testlisting", async (req, res) => {
  const sampleStudent = new Student({
    name: "Gautam kumar",
    image: "/uploads/images/anu.jpg",
    batch: "2022-25",
  });
  await sampleStudent.save();
  console.log("sample was saved");
  res.send("successfully saved");
});

app.listen(5000, () => {
  console.log("server is listining to port 8080");
});
