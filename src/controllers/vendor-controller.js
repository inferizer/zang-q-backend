const bcrypt = require('bcryptjs')
const prisma = require('../models/prisma')
const jwt = require('jsonwebtoken')
const {vendorRegisterSchema,vendorLoginSchema} = require('../validator/vendor-validator')



exports.register = async (req, res, next) => {
  try {
        const {value,error} = vendorRegisterSchema.validate(req.body)
        if(error) return next(error)
        value.password = await bcrypt.hash(value.password,10)
      const user = await prisma.shopAccount.create({
        data:value
      })
      const payload = {userId: user.id ,role: user.role}
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "qwertyuiop",{
        expiresIn : process.env.JWT_VENDOR_EXPIRE
      })
      delete user.password

    res.status(200).json({ accessToken,user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = vendorLoginSchema.validate(req.body)
    if (error) {
      return next(error);
    }
    const user = await prisma.shopAccount.findUnique({
      where:{
        email:value.email
      }
    })
    
    
    if (!user) {
      return next(createError('invalid Login', 400));
    }
    
    const compareMatch = await bcrypt.compare(value.password, user.password)
    if (!compareMatch) {
      return next(createError('invalid Login', 400));
    }
    const payload = { userId: user.id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || 'qwertyuiop', {
      expiresIn: process.env.JWT_EXPIRE
    });
    delete user.password;
    res.status(200).json({ accessToken,user });
  } catch (err) {
    next(err);
  }
};
