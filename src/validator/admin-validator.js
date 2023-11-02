const Joi = require("joi");

const adminRegisterSchema = Joi.object({
  username: Joi.string()
  .pattern(/^[a-zA-Z0-9]{5,30}$/)
  .trim().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
});

exports.adminRegisterSchema = adminRegisterSchema;

const adminLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

exports.adminLoginSchema = adminLoginSchema;
