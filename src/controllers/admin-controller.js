const bcrypt = require('bcryptjs');
const createToken = require("../utils/jwt")
const { adminRegisterSchema, adminLoginSchema } = require('../validator/admin-validator');
const prisma = require('../models/prisma');

exports.register = async (req, res, next) => {
  try {
    const { value, error } = adminRegisterSchema.validate(req.body);
    if (error) {
      return next(error)

    } console.log(value)
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
    
    const compareMatch = await bcrypt.compare(value.password, user.password)
    if (!compareMatch) {
      return next(createError('invalid Login', 400));
    }
    const payload = { userId: user.id };
    const accessToken = createToken(payload)

    delete user.password;
    res.status(200).json({ accessToken, msg: "Welcome Admin!!!" });
  } catch (err) {
    next(err);
  }
};

exports.getAdmin = async (req, res, next) => {
  try {
    const user = await prisma.users.findFirst({
      where: {
        id: req.user.id
      }
    })
    res.status(200).json({ user })
  } catch (err) {
    next(err)
  }
};

// find 

exports.find_All_Shop = async (req, res, next) => {
  try {
    const shopData = await prisma.shops.findMany({
      select: {
        id: true,
        registerationNumber: true,
        shopName: true,
        shopLat: true,
        shopLan: true,
        shopMobile: true,
        openingTimes: true,
        closeingTimes: true,
        currentQueueNumber: true,
        shopPicture: true,
        ownerFirstName: true,
        ownerLastName: true,
        idNumber: true,
        idCard: true,
        isOpen: true,
        isApprove: true,
        shopAccount: true,
        shopAccountId: true
      }
    })
    res.status(200).json({ shopData })
  } catch (err) {
    next(err)
  }
}
exports.approved = async (req, res, next) => {
  try {
    const { id } = req.body;
    const approvedShop = await prisma.shops.update({
      where: {
        id: id,
        isApprove: "pending"
      },
      data: {
        isApprove: "approved"
      }
    });

    console.log(approvedShop);
    res.status(200).json({ approvedShop });
  } catch (err) {
    next(err);
  } 
};

exports.reject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rejectShop = await prisma.shops.delete({
      where: {
        id: +id
      }
    })
    res.status(201).json({msg:'reject', rejectShop })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

