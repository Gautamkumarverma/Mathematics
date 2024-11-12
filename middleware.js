module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Store original URL
    req.flash("error", "you must be logged in before accessing pdf!");
    return res.redirect("/login");
  }
  next();
};
// this middleware use ,when user not login but try to access pdf 
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};