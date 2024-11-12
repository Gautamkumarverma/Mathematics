const Listing = require("../models/listing");

module.exports.renderhome = (req, res) => {
  res.render("home/homepage.ejs");
};
module.exports.uploadPdf = async (req, res) => {
  const { title, class: classField, subject } = req.body;
  let url = req.file.path;
  let filename = req.file.filename;

  const sampleListing = new Listing({
    title: title,
    class: classField,
    subject: subject,
  });
  sampleListing.pdflink = { url, filename };

  await sampleListing.save();
  console.log("you are here Gautam ");
  console.log(url, "...", filename);

  
  req.flash("success", "pdf uploded successfully!");
  // Redirect to /showPdf with classField as query parameter
  res.redirect(`/showPdf?classField=${encodeURIComponent(classField)}`);
};

module.exports.destroyPdf = async (req, res) => {
  const { id } = req.params;
  const listingToDelete = await Listing.findById(id);

  if (listingToDelete) {
    const classField = listingToDelete.class;
    await Listing.findByIdAndDelete(id);

    // Redirect to /showPdf with classField as query parameter
    req.flash("success", "pdf deleted successfully!");
    
    res.redirect(`/showPdf?classField=${encodeURIComponent(classField)}`);
  } else {
    res.send("Listing not found.");
  }
};

module.exports.showlevel1 = async (req, res) => {
  res.render("home/showpdflavel1.ejs");
};

module.exports.showListing = async (req, res) => {
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
};
