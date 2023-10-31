const bcrypt = require('bcryptjs')
const prisma = require('../models/prisma')
const jwt = require('jsonwebtoken')
const {cloudinary} = require('../utils/cloudinary')
const fs = require('fs/promises')

const {vendorRegisterSchema,vendorLoginSchema} = require('../validator/vendor-validator');
const createError = require('../utils/create-error');

const hdl_application_body =  (body) => {
    const data = {}
  if(body.shopName) data.shopName = body.shopName
  if(body.shopLat) data.shopLat = body.shopLat
  if(body.shopLan) data.shopLan = body.shopLan
  if(body.shopMobile) data.shopMobile = body.shopMobile
  if(body.openingTimes) data.openingTimes = body.openingTimes
  if(body.closingTimes) data.closingTimes = body.closingTimes
  if(body.ownerFirstName) data.ownerFirstName = body.ownerFirstName
  if(body.ownerLastName) data.ownerLastName = body.ownerLastName
  if(body.idNumber) data.idNumber = body.idNumber
  return data
}
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

exports.application = async (req,res,next) => {
  try{
    
    if(!req.user.role == "vendor") return next(createError("only vendor permitted",400))
    if(!req.files) return next(createError("all image required",400))
    const data = {}
  data.shopAccountId = req.user.id
    const result = hdl_application_body(req.body)
    
    if(req.files.shopPic){
      const result = await cloudinary(req.files.shopPic[0].path)
      data.shopPic = result
    }

    if(req.files.idCard){
      const result = await cloudinary(req.files.idCard[0].path)
      data.idCard = result
    }
    console.log(data)
    const application = await prisma.shops.create({
      data:data
    })


    res.status(200).json({msg:"apllication registered",application})

  }catch(err){
    console.log(err)
  }
  finally{
    if(req.files.shopPic){
      fs.unlink(req.files.shopPic[0].path)
      
    }
    if(req.files.idCard){
      fs.unlink(req.files.idCard[0].path)
  
    }


  }

}


