const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");
const createToken = require("../utils/jwt");
const { cloudinary } = require("../utils/cloudinary");
const fs = require("fs/promises");
const dateFormat = require('../utils/dateFormat')

const {
  vendorRegisterSchema,
  vendorLoginSchema,
} = require("../validator/vendor-validator");
const createError = require("../utils/create-error");
const VENDOR = "vendor";
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { exist } = require("joi");
dayjs.extend(utc);
const categories_id_validation = async (data) => {
  const existcategories = await prisma.categories.findMany();
  for (let x of data) {
    let found = false;
    for (let y of existcategories) {
      if (x.categoriesId == y.id) {
        found = true;
      }
    }
    if (!found) return false;
  }
  return true;
};
const hdl_application_body = (body) => {
  const data = {};
  if (body.shopName) data.shopName = body.shopName;
  if (body.shopLat) data.shopLat = +body.shopLat;
  if (body.shopLan) data.shopLan = +body.shopLan;
  if (body.shopMobile) data.shopMobile = body.shopMobile;
  if (body.openingTimes) data.openingTimes = body.openingTimes;
  if (body.closingTimes) data.closingTimes = body.closingTimes;
  if (body.ownerFirstName) data.ownerFirstName = body.ownerFirstName;
  if (body.ownerLastName) data.ownerLastName = body.ownerLastName;
  if (body.idNumber) data.idNumber = body.idNumber;
  return data;
};
exports.register = async (req, res, next) => {
  try {
    const { value, error } = vendorRegisterSchema.validate(req.body);
    const existEmail = await prisma.shopAccount.findUnique({
      where: {
        email: value.email,
      },
    });
    console.log(existEmail);
    if (existEmail) return next(createError("Email already in used", 400));
    if (error) return next(error);
    value.password = await bcrypt.hash(value.password, 10);
    const user = await prisma.shopAccount.create({
      data: value,
    });
    const payload = { userId: user.id, role: user.role };
    const accessToken = createToken(payload);
    delete user.password;

    res.status(200).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = vendorLoginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const existUser = await prisma.shopAccount.findUnique({
      where: {
        email: value.email,
      },
      
  
      
    });

    if (!existUser) {
      return next(createError("invalid Login", 400));
    }

    const compareMatch = await bcrypt.compare(value.password, existUser.password);
    if (!compareMatch) {
      return next(createError("invalid Login", 400));
    }

    const user = await prisma.shopAccount.findUnique({
      where:{
        id:existUser.id
      },
        include:{
          Shops:{
            select:{
              shopName:true,
              shopPicture:true
            }
          }
        }
    })
    const payload = { userId: user.id, role: user.role };
    const accessToken = createToken(payload);
    delete user.password;
    res.status(200).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

exports.application = async (req, res, next) => {

  console.log(req.body)
  try {
    const { role } = req.user;

    if (role != VENDOR) return next(createError("only vendor permitted", 400));
    if (!req.files) return next(createError("all image required", 400));
    const approvedApplication = await prisma.shops.findMany({
      where: {
        isApprove: "approved",
        shopAccountId: req.user.id,
      },
    });
    if (approvedApplication.length > 0)
      return next(
        createError("This vendor's appliation has already been approved", 400)
      );
    const existApplication = await prisma.shops.findMany({
      where: {
        isApprove: "pending",
        shopAccountId: req.user.id,
      },
    });
    if (existApplication.length > 0)
      return next(createError("only one application allow per vendor"));
    let data = {};
    data.shopAccountId = +req.user.id;
    let req_input = hdl_application_body(req.body);
    data = { ...data, ...req_input };

    if (req.files.shopPicture) {
      const result = await cloudinary(req.files.shopPicture[0].path);
      data.shopPicture = result;
    }

    if (req.files.idCard) {
      const result = await cloudinary(req.files.idCard[0].path);
      data.idCard = result;
    }

    const result = await prisma.shops.create({
      data: data,
    });

    res.status(200).json({ message: "aplication registered", result });
  } catch (err) {
    console.log(err);
  } finally {
    if (req.files.shopPicture) {
      fs.unlink(req.files.shopPicture[0].path);
    }
    if (req.files.idCard) {
      fs.unlink(req.files.idCard[0].path);
    }
  }
};

exports.getAllCategory = async (req, res, next) => {
  const result = await prisma.categories.findMany();
  res.status(200).json({ result });
};

exports.addVendorCategory = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { shopsId } = req.params;

    if (role != VENDOR) return next(createError("only vendor permitted", 400));

    const approvedCategories = await prisma.shopsCategories.findFirst({
      where: {
        shopsId: +shopsId,
      },
    });
    if (approvedCategories)
      return next(
        createError("This vendor's categories has already been approved", 400)
      );
    const existCategoryRequest = await prisma.shopsCategories.findFirst({
      where: {
        shopsId: +shopsId,
      },
    });
    if (existCategoryRequest)
      return next(
        createError("this vendor's categories has already been submitted", 400)
      );

    let data = req.body;
    const found = categories_id_validation(data);
    if (!found) return next(createError("invalid category", 400));
    for (let i of data) {
      i.shopsId = +shopsId;
      i.categoriesId = +i.categoriesId;
    }
    await prisma.shopsCategories.createMany({
      data: data,
    });

    res.status(200).json({ message: "vendor category added" });
  } catch (err) {
    console.log(err);
  }

}

exports.findResevation = async (req, res, next) => {
  const { id } = req.user
  const { shopId } = req.body
  try {
    const currentVendor = await prisma.shops.findMany({
      where: {
        shopAccountId: id,
      },
    });
    const shopId = currentVendor.length > 0 ? currentVendor[0].id : null;
    const result = await prisma.resevations.findMany({
      where: {
        shopId: shopId,
        status: "pending",
        date: dayjs().format("DD MMMM YYYY"),      },
      include: {
        user: true,

      },
    });
    // console.log(result)
    res.status(200).json({ result })
  } catch (err) {
    console.log(err)
  }
}

exports.getMyShop = async (req, res, next) => {
  const { id } = req.user
  try {
    const result = await prisma.shops.findMany({
      where: {
        shopAccountId:id,
      },
    });
    res.status(201).json({ result })
  } catch (err) {
    console.log(err)
  }
}

exports.getSingleShop = async (req,res,next) =>{
  const { id } = req.params

  
  try {
    const result = await prisma.shops.findMany({
      where: {
        id: +id,
      },
    });

    res.status(201).json({ result })
  } catch (err) {
    console.log(err)
  }
}

exports.deleteResevation = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cancel = await prisma.resevations.delete({
      where: {
        id: +id
      }
    })
    res.status(201).json({ cancel })
  } catch (err) {
    next(err)
  }
}

exports.approveResevation = async (req, res, next) => {
  try {
    const { id } = req.body;

    const result = await prisma.resevations.update({
      where: { id: +id },
      data: {
        status: "accepted",
      },
    });
    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
};
exports.rejectedResevation = async (req, res, next) => {
  const { id } = req.body;
  try {
    const result = await prisma.resevations.update({
      where: {
        id: +id,
      },
      data: {
        status: "cancelled",
      },
    });

    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.closeQueue = async (req, res, next) => {
  try {
    const { id } = req.user;
    console.log(req.body)
    const result = await prisma.shops.update({  
      where: { id: id },
      data: {
        isOpen: false,
      },
    });
    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.openShop = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result = await prisma.shops.update({
      where: { id: id },
      data: {
        isOpen: true,
      },
    });
    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
};
exports.historyResevation  =  async (req, res, next) => {
  const { shopId,value } = req.body
  try {
    const convertFormat = dateFormat(value)
    // console.log(convertFormat)
    const result = await prisma.resevations.findMany({
      where: {
        shopId: shopId,
        date: convertFormat
      },
      include : {
        user: true
      }
    });
    res.status(201).json({result})
    console.log(result)
  } catch (err) {
    console.log(err)
  }
} 


exports.vendorEdit = async(req,res,next) =>{
  try{
    const {id} = req.params
    const data = {}
    const existUser = await prisma.shopAccount.findUnique({
      where:{
        id: +id
      }
    })
    if(!existUser) return next(createError("this user does not exist"))

    if(req.files){

    }

    if(!req.files){

    }

  }
  catch(err){
    next(err)

  }
}