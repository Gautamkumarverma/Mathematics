const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  pdflink: {
    type: String,
    default: "uploads\\1729673427565-MST_II schedule_IIIrd_vth sem.pdf",
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
