if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const multer = require("multer");
const Listing = require("./models/listing.js");
const Student = require("./models/students.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require("joi");

const listingRoute = require("./routes/listing.js");
const studentRoute = require("./routes/student.js");
const userRoute = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const methodOverride = require("method-override");
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
app.use("/documents", express.static(path.join(__dirname, "documents")));

app.use(express.static(path.join(__dirname, "pages")));

app.use(methodOverride("_method"));

const sessionOptions = {
  secret: "mysupersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// <-----this is for authentication-------->
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// <-----------till here------------->

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
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

app.get("/os/page1", (req, res) => {
  res.render("documents/Os/pp/os.ejs");
});

app.get("/views/documents/Networking/pp/networking.ejs", (req, res) => {
  res.render("documents/Networking/pp/networking.ejs");
});

app.get("/views/documents/Dbms/pp/db.ejs", (req, res) => {
  res.render("documents/Dbms/pp/db.ejs");
});

app.get("/views/documents/Os/pp/os.ejs", (req, res) => {
  res.render("documents/Os/pp/os.ejs");
});

// Dynamic route for topics
app.get("/views/documents/:topic/pages/:page", (req, res) => {
  const { topic, page } = req.params;
  const filePath = `documents/${topic}/pages/${page}.ejs`;

  res.render(filePath, (err, html) => {
    if (err) {
      return res.status(404).send("Page not found");
    }
    res.send(html);
  });
});

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

app.get("/", (req, res) => {
  res.render("home/homepage.ejs");
});

app.get("/demouser", async (req, res) => {
  const fakeUser = new User({
    email: "demouser@gmail.com",
    username: "demouser",
  });

  let registereduser = await User.register(fakeUser, "helloworld");
  res.send(registereduser);
});
app.use("/listings", listingRoute);
app.use("/students", studentRoute);
app.use("/", userRoute);
//privacy route
app.get("/conditions/privacy", (req, res) => {
  res.render("conditions/privacy.ejs");
});
//terms route
app.get("/conditions/terms", (req, res) => {
  res.render("conditions/terms.ejs");
});

app.get("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.render("error.ejs", { message });
});
app.listen(5000, () => {
  console.log("server is listining to port 5000");
});
