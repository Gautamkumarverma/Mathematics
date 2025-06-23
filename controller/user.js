const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // 🔒 Password strength check
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%#&])[A-Za-z\d@$%#&]{8,}$/;

    if (!passwordRegex.test(password)) {
      req.flash(
        "error",
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, %, #, &)."
      );
      return res.redirect("/signup");
    }

    const newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);

    // ✅ Make first user an admin
    const userCount = await User.countDocuments({});
    if (userCount === 1) {
      registeredUser.isAdmin = true;
      await registeredUser.save();
      req.flash(
        "success",
        "You are the first user and have been made an admin!"
      );
    } else {
      req.flash("success", "Welcome to Mathematics Team!");
    }

    // Log in user
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/listings/home");
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
