//rename endpoint => /me move to auth-controller
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.login = async (req, res, next) => {
  try {
    const user = await prisma.users.upsert({
      where: {
        email: req.user.email,
      },
      update: {
        googleId: req.user.id,
      },
      create: {
        accessToken: req.user.body,
        email: req.user.email,
        googleId: req.user.id,
      },
    });

    if (user) {
      const accessToken = jwt.sign(
        { googleId: user.googleId, role: user.role },
        process.env.JWT_SECRET_KEY || "defaultRandom"
      );
      return res.json({ accessToken, user });
    }
    const newUser = await prisma.users.create({
      data: {
        email: req.user.email,
        googleId: req.user.id,
      },
    });
    res.sendStatus(200).json({ accessToken, newUser });
  } catch (error) {
    next(error);
  }
};

// exports.getMe = async (req, res, next) => {
//   try {
//     const user = await prisma.user.findFirst({
//       where: {
//         googleId: req.body.email,
//       },
//     });

//     if (user) {
//       const accessToken = jwt.sign(
//         { googleId: user.googleId, role: user.role },
//         process.env.JWT_SECRET_KEY || "defaultRandom"
//       );
//       res.json({ accessToken });
//     } else {
//       await prisma.users.create({
//         data: {
//           email: req.body.email,
//         },
//       });
//       res.sendStatus(200).json({ msg: "not found" });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// exports.logout = async (req, res, next) => {
//   try {
//     req.logout();
//     req.session.destroy();
//     res.sendStatus(200);
//   } catch (error) {
//     next(error);
//   }
// };
