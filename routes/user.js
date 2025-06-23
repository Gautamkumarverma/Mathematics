const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const LocalStrategy = require("passport-local");
const userCoroller = require("../controller/user.js");

// signup render form  ->route
// sign route

router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup.ejs");
  })
  .post(wrapAsync(userCoroller.signUp));

// login form render -> route
//login
router
  .route("/login")
  .get(userCoroller.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userCoroller.login
  );

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings/home");
  });
});
module.exports = router;
