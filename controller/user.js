const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};
module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({
      email,
      username,
    });

    let registereduser = await User.register(newUser, password);

    // this is for automatic login when user signup
    req.login(registereduser, (err) => {
      if (err) {
        return next();
      } else {
        req.flash("success", "Welcome to mathematics team!");
        res.redirect("/listings/home");
      }
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};
module.exports.login = async (req, res) => {
  req.flash("success", "welcome o Mathematics,ou are logged in!");
  let redirectUrl = res.locals.redirectUrl || "/listings/home";
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings/home");
  });
};
