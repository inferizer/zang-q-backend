const prisma = require("../models/prisma");
exports.getallShop = async (req, res, next) => {
  const result = await prisma.shops.findMany({
    include: {
      ShopsCategories: {
        include: {
          categories: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    where: {
      isApprove: "approved",
    },
  });

  res.status(200).json({ result });
};

exports.getallCategory = async (req, res, next) => {
  const result = await prisma.categories.findMany({
    include: {
      ShopsCategories: {
        include: {
          shop: {
            select: {
              shopPicture: true,
              shopName: true,
              isApprove:true
            },
          },
        },
      },
    },
    
  });
  res.status(200).json({ result });
};
