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
const fs = require("fs");
const listingRoute = require("./routes/listing.js");
const studentRoute = require("./routes/student.js");
const userRoute = require("./routes/user.js");
const courseRoute = require("./routes/course.js");
const { isLoggedIn, isAdmin } = require("./middleware.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const methodOverride = require("method-override");
// const MONGO_URl = "mongodb://127.0.0.1:27017/team";
const dburl = process.env.ATLASBD_URL;
main()
  .then(() => {
    console.log("conected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

//serve static files
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "/public")));

app.use("/documents", express.static(path.join(__dirname, "documents")));

app.use(express.static(path.join(__dirname, "pages")));

app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: dburl,
  secret: process.env.SECRET,
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("Error in session store", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
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
}

app.get("/os", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "check", "Os", "os.html"));
});
app.get("/networking", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "check", "Networking", "networking.html")
  );
});
app.get("/dbms", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "check", "Dbms", "dbms.html"));
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
app.get("/makeadmin/:username", isAdmin, async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (user) {
    user.isAdmin = true;
    await user.save();
    req.flash("success", `${user.username} is now an admin.`);
    res.redirect("/"); // or wherever you want
  } else {
    req.flash("error", "User not found.");
    res.redirect("/");
  }
});
//middleware section
app.use("/listings", listingRoute);
app.use("/students", studentRoute);
app.use("/", userRoute);
app.use("/courses", courseRoute);
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
app.listen(3000, () => {
  console.log("server is listining to port 3000");
});
