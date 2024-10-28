const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  pdflink: {
    type: String,
    default: "uploads\\1729673427565-MST_II schedule_IIIrd_vth sem.pdf",
  },
  imageLink: {
    type: String,
  },
  class: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
