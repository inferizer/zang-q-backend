const Joi = require("joi");

const vendorRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
});

exports.vendorRegisterSchema = vendorRegisterSchema;

const vendorLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

exports.vendorLoginSchema = vendorLoginSchema;

// const vendorEditSchema = Joi.object({
//   shopMobile: Joi.string().pattern(/^[0-9]{10}$/),
//   openingTimes: Joi.string(),
//   closingTimes: Joi.string(),
//   ownerFirstName: Joi.string(),
//   ownerLastName: Joi.string(),
//   shopLan

// })