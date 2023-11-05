const bcrypt = require('bcryptjs');
const createToken = require("../utils/jwt")
const { adminRegisterSchema, adminLoginSchema } = require('../validator/admin-validator');
const prisma = require('../models/prisma');
const createError = require('../utils/create-error');
const PENDING = "pending"
const APPROVED = "approved"
const ADMIN = "admin"

exports.register = async (req, res, next) => {
  try {
    const { value, error } = adminRegisterSchema.validate(req.body);
    if (error) return next(error)
    value.password = await bcrypt.hash(value.password, 10);
    const user = await prisma.users.create({
      data: { ...value, role: "admin" }
    })
    const payload = { userId: user.id, };
    const accessToken =  createToken(payload)
    delete user.password;
    res.status(200).json({ accessToken, message: 'admin registered' });
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { value, error } = adminLoginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const user = await prisma.users.findFirst({
      where: {
        username: value.username
      }
    })
    if (!user) {
      return next(createError('invalid Login', 400));
    }
    
    const compareMatch =  bcrypt.compare(value.password, user.password)
    if (!compareMatch) return next(createError('invalid Login', 400));
    const payload = { userId: user.id };
    const accessToken = createToken(payload)
    delete user.password;
    res.status(200).json({ accessToken, msg: "Welcome Admin!!!" });
  } catch (err) {
    next(err);
  }
};

// find 

exports.find_All_Shop = async (req, res, next) => {
  try {
    const result = await prisma.shops.findMany()
    res.status(200).json({ result })
  } catch (err) {
    next(err)
  }
}

exports.rejectApplication = async (req,res,next) => {


  
}

exports.approvedApplication = async (req, res, next) => {
  try {
    const { id } = req.body
    const approveShop = await prisma.shops.findMany({
      select: {
        id: true,
        isApprove: true,
     }
    })
    await prisma.shops.update({
      where : {
        shops : id},
      data : {
        isApprove: "approved"
      }
    })

    res.status(200).json({ approveShop })
  } catch (err) {
    next(err)
  }
}


exports.getAllPendingShopApplication = async (req,res,next) =>{
      const {role} = req.user
      if(role !=  ADMIN) return next(createError)("Only admin is allowed to perform this action",400)
      const  result = await prisma.shops.findMany({
    where:{
      isApprove:PENDING
    }})
      
    res.status(200).json({result})

}



