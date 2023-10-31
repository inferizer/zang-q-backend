const createError = require('../utils/create-error');
const jwt = require('jsonwebtoken');
const prisma = require('../models/prisma');
const ADMIN = "admin"
const VENDOR = "vendor"
const USER = "user"

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(createError('unauthenticated', 401));
    }

    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || 'qwertyuiop');

    if(payload.role == VENDOR){
      
      const user =  await prisma.shopAccount.findUnique({
        where:{
          id: payload.userId
        }
      })
      if (!user) return next(createError('unauthenticated', 401));
      delete user.password
      
      req.user = user

      return next()
      
    }
  
      const user = await prisma.users.findUnique({
        where: {
          id: payload.userId
        }
      });
      if (!user) return next(createError('unauthenticated', 401));
        delete user.password;
    req.user = user;
      
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      err.statusCode = 401;
    }
    next(err);
  }
};
