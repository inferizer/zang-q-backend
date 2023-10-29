
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('../utils/create-error');
const { UserRegisterSchema, UserLoginSchema } = require('../validator/auth-validator');
const prisma = require('../models/prisma')
const user_login = async (value) =>{
  if(value.mobile){
    const user = await prisma.users.findFirst({
      where:{
        mobile:value.mobile
      }
    })
    return user
  }

  if(value.email){
    const user = await prisma.users.findFirst({
      where:{
        email:value.email
      }
      
    })
    return user
  }

  return null

}

exports.getAuthUser =  async (req,res,next) =>{

  try{
    const user = await prisma.users.findFirst({
      where:{
        id:req.user.id
      }
    }) 
    if(!user) return next(createError("user not found",400))
    res.status(200).json({user})
  }
  catch(err){
    next(err)
  }
}
exports.register = async (req,res,next) => {
    try {
        const { value, error } = UserRegisterSchema.validate(req.body);
        if (error) {
          return next(error)
        }
        value.password = await bcrypt.hash(value.password, 10);
        const user = await prisma.users.create({
          data: value
        });
        const payload = { userId: user.id };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || 'qwertyuiop', {
          expiresIn: process.env.JWT_EXPIRE
        });
        res.status(201).json({ accessToken, user });
      } catch (err) {
        next(err);
      }
    };
    

exports.login = async (req, res, next) => {
        try {
          const { value, error } = UserLoginSchema.validate(req.body)
          if (error) {
            return next(error);
          }
       const user = await user_login(value)
          // const user = await prisma.user.findFirst({
          //   where: {
          //        userName: value.userName 
          //   }
          // });
          if (!user) {
            return next(createError('invalid Login', 400));
          }
          console.log(user)
          const compareMatch = await bcrypt.compare(value.password, user.password)
          if (!compareMatch) {
            return next(createError('invalid Login', 400));
          }
          const payload = { userId: user.id };
          const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || 'qwertyuiop', {
            expiresIn: process.env.JWT_EXPIRE
          });
      
          delete user.password;
          res.status(200).json({ accessToken,user });
        } catch (err) {
          next(err);
        }
      };

