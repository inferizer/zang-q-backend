const bcrypt = require("bcryptjs");
const createToken = require("../utils/jwt");
const {
  adminRegisterSchema,
  adminLoginSchema,
  categorySchema,
} = require("../validator/admin-validator");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const PENDING = "pending";
const APPROVED = "approved";
const ADMIN = "admin";

exports.register = async (req, res, next) => {
  try {
    const { value, error } = adminRegisterSchema.validate(req.body);
    console.log(value);
    if (error) return next(error);
    value.password = await bcrypt.hash(value.password, 10);
    const user = await prisma.users.create({
      data: { ...value, role: "admin" },
    });
    const payload = { userId: user.id };
    const accessToken = createToken(payload);
    delete user.password;
    res.status(200).json({ accessToken, message: "admin registered" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = adminLoginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const user = await prisma.users.findFirst({
      where: {
        username: value.username,
      },
    });
    if (!user) {
      return next(createError("invalid Login", 400));
    }

    const compareMatch = bcrypt.compare(value.password, user.password);
    if (!compareMatch) return next(createError("invalid Login", 400));
    const payload = { userId: user.id };
    const accessToken = createToken(payload);
    delete user.password;
    res.status(200).json({ accessToken, msg: "Welcome Admin!!!", user });
  } catch (err) {
    next(err);
  }
};

// find

exports.find_All_Shop = async (req, res, next) => {
  try {
    const result = await prisma.shops.findMany();
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.rejectApplication = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { id } = req.params;
    if (role != ADMIN)
      return next(
        createError("only admin is permitted to perform this action", 400)
      );
    const existApplication = await prisma.shops.findFirst({
      where: { id: +id },
    });
    if (!existApplication)
      return next(
        createError("no application submitted from this vendor", 400)
      );
    console.log(existApplication);
    await prisma.shops.deleteMany({
      where: {
        id: existApplication.id,
      },
    });

    await prisma.shopsCategories.deleteMany({
      where: {
        shopsId: +id,
      },
    });

    const result = await prisma.shops.findMany({
      where: {
        isApprove: PENDING,
      },
    });

    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.approvedApplication = async (req, res, next) => {
  try {
    console.log("approve body", req.body);
    const { role } = req.user;
    const { id } = req.body;
    if (role != ADMIN)
      return next(
        createError("only admin is permitted to perform this action", 400)
      );
    const existApplication = await prisma.shops.findFirst({
      where: { id: +id },
    });
    if (!existApplication)
      return next(
        createError("no application submitted from this vendor", 400)
      );
    await prisma.shops.update({
      where: { id: existApplication.id },
      data: {
        isApprove: APPROVED,
      },
    });

    const result = await prisma.shops.findMany({
      where: {
        isApprove: PENDING,
      },
    });

    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.getAllPendingShopApplication = async (req, res, next) => {
  const { role } = req.user;
  if (role != ADMIN)
    return next(createError)(
      "Only admin is allowed to perform this action",
      400
    );
  const result = await prisma.shops.findMany({
    where: {
      isApprove: PENDING,
    },
  });

  res.status(200).json({ result });
};

exports.getAllApprovedShopApplication = async (req, res, next) => {
  const { role } = req.user;
  if (role != ADMIN)
    return next(createError)(
      "Only admin is allowed to perform this action",
      400
    );
  const result = await prisma.shops.findMany({
    where: {
      isApprove: APPROVED,
    },
  });

  res.status(200).json({ result });
};

exports.getAllCategory = async (req, res, next) => {
  const { role } = req.user;
  if (role != ADMIN)
    return next(
      createError("Only admin is allowed to perform this action", 400)
    );
  const result = await prisma.categories.findMany();
  res.status(200).json({ result });
};

exports.createCategory = async (req, res, next) => {
  const { role } = req.user;
  if (role != ADMIN)
    return next(
      createError("Only admin is allowed to perform this action", 400)
    );
  const { value, error } = categorySchema.validate(req.body);
  if (error) return next(error);
  const existCategory = await prisma.categories.findMany();
  for (let i of existCategory) {
    if (value.name.toUpperCase() == i.name.toUpperCase())
      return next(createError("category already exist", 400));
  }
  await prisma.categories.create({
    data: value,
  });

  const result = await prisma.categories.findMany();
  res.status(200).json({ result });
};
exports.updateCategory = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { id, name } = req.body;
    if (role != ADMIN)
      return next(
        createError("Only admin is allowed to perform this action", 400)
      );

    const selectedCategory = await prisma.categories.findUnique({
      where: {
        id: id,
      },
    });
    if (!selectedCategory)
      return next(createError("please provide valid category", 400));
    await prisma.categories.update({
      where: {
        id: selectedCategory.id,
      },
      data: {
        name: name,
      },
    });
    const result = await prisma.categories.findMany();
    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
  }
};
exports.deleteCategory = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { id } = req.params;
    if (role != ADMIN)
      return next(
        createError("Only admin is allowed to perform this action", 400)
      );

    const selectedCategory = await prisma.categories.findFirst({
      where: {
        id: +id,
      },
    });
    if (!selectedCategory)
      return next(createError("please provide valid category", 400));
    await prisma.categories.delete({
      where: {
        id: selectedCategory.id,
      },
    });

    const result = await prisma.categories.findMany();

    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
  }
};
