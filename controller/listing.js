const { isAdmin, isLoggedIn } = require("../middleware");
const Listing = require("../models/listing");

module.exports.renderhome = (req, res) => {
  res.render("home/homepage.ejs");
};

(module.exports.uploadPdf = isLoggedIn),
  isAdmin,
  async (req, res) => {
    const { title, class: classField, subject } = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "...", filename);

    const sampleListing = new Listing({
      title: title,
      class: classField,
      subject: subject,
    });
    filename += ".pdf";
    console.log("new filename:", filename);
    sampleListing.pdflink = { url, filename };
    await sampleListing.save();
    console.log("pdf url", url);
    console.log("cloudianry url", sampleListing.pdflink.url);
    req.flash("success", "pdf uploded successfully!");
    // Redirect to /showPdf with classField as query parameter
    res.redirect(`/showPdf?classField=${encodeURIComponent(classField)}`);
  };

(module.exports.destroyPdf = isLoggedIn),
  isAdmin,
  async (req, res) => {
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

// module.exports.showListing = async (req, res) => {
//   const selectedClass = req.query.class;
//   const pdfClass = "class" + selectedClass + "th";
//  let allListings = null;

//   let allMathsListings = await Listing.find({
//     class: pdfClass,
//     subject: "Maths",
//   });
//   let allPhysicsListings = await Listing.find({
//     class: pdfClass,
//     subject: "Physics",
//   });
//   let allChemistryListings = await Listing.find({
//     class: pdfClass,
//     subject: "Chemistry",
//   });
//   let allBiologyListings = await Listing.find({
//     class: pdfClass,
//     subject: "Biology",
//   });

//   res.render("home/showpdf.ejs", {
//     allBiologyListings,
//     allChemistryListings,
//     allMathsListings,
//     allPhysicsListings,
//   });
// };
module.exports.showListing = async (req, res) => {
  const selectedClass = req.query.class;
  const pdfClass = "class" + selectedClass + "th";

  // Find listings by class and subject
  const allMathsListings = await Listing.find({
    class: pdfClass,
    subject: "Maths",
  });
  const allPhysicsListings = await Listing.find({
    class: pdfClass,
    subject: "Physics",
  });
  const allChemistryListings = await Listing.find({
    class: pdfClass,
    subject: "Chemistry",
  });
  const allBiologyListings = await Listing.find({
    class: pdfClass,
    subject: "Biology",
  });

  // Render the page and send the modified listings
  res.render("home/showpdf.ejs", {
    allMathsListings,
    allChemistryListings,
    allBiologyListings,
    allPhysicsListings,
  });
};
