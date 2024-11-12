
const Joi = require("joi");
const { model } = require("mongoose");


module.exports.studentSchema = Joi.object({
    student: Joi.object({
      name: Joi.string().required(),
      image: Joi.string().optional(),
      marks: Joi.string().required(),
      class: Joi.string().required(),
      batch: Joi.string().required(),
      board: Joi.string().optional(),
      city: Joi.string().optional(),
    }).required(),
  });
  