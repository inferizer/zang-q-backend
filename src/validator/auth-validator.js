const Joi = require("joi");

const UserRegisterSchema = Joi.object({
  username: Joi.string(),
  emailOrMobile: Joi.alternatives([
    Joi.string().email(),
    Joi.string().pattern(/^[0-9]{10}$/),
  ])
    .required()
    .strip(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
  mobile: Joi.forbidden().when("emailOrMobile", {
    is: Joi.string().pattern(/^[0-9]{10}$/),
    then: Joi.string().default(Joi.ref("emailOrMobile")),
  }),
  email: Joi.forbidden().when("emailOrMobile", {
    is: Joi.string().email(),
    then: Joi.string().default(Joi.ref("emailOrMobile")),
  }),
});
exports.UserRegisterSchema = UserRegisterSchema;

const UserLoginSchema = Joi.object({  
  emailOrMobile: Joi.alternatives([
    Joi.string().email(),
    Joi.string().pattern(/^[0-9]{10}$/),
  ])
    .required()
    .strip(),
  password: Joi.string().required(),
  mobile: Joi.forbidden().when("emailOrMobile", {
    is: Joi.string().pattern(/^[0-9]{10}$/),
    then: Joi.string().default(Joi.ref("emailOrMobile")),
  }),
  email: Joi.forbidden().when("emailOrMobile", {
    is: Joi.string().email(),
    then: Joi.string().default(Joi.ref("emailOrMobile")),
  }),
});

exports.UserLoginSchema = UserLoginSchema;


const GoogleLoginSchema = Joi.object({
  username:Joi.string().required(),
  email: Joi.string().email().required(),
  googleId: Joi.string().required(),
  profileImage: Joi.string().required()
})

exports.GoogleLoginSchema = GoogleLoginSchema

const UserEditSchema = Joi.object({
  username:Joi.string(),
  email:Joi.string().email(),
  mobile:Joi.string().pattern(/^[0-9]{10}$/)
})

exports.UserEditSchema = UserEditSchema
// userSchema , adminShcema ,venderSchem
