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

module.exports.courseSchema = Joi.object({
  course: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    videoUrl: Joi.string().uri().required(),
    thumbnail: Joi.string().uri().optional().allow(""), // optional thumbnail
    price: Joi.number().min(0).required(),
    discount: Joi.string().optional().allow(""), // like "10%" or empty
    labels: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .optional(),
  }).required(),
});
