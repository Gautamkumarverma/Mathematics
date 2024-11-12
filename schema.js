const Joi = require("joi");
const { model } = require("mongoose");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    pdflink: Joi.string().optional(),
    imagelink: Joi.string().required(),
    class: Joi.string().required(),
    subject: Joi.string().required(),
  }).required(),
});
