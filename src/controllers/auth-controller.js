const bcrypt = require("bcryptjs");
const createToken = require("../utils/jwt");
const createError = require("../utils/create-error");
const {
  UserRegisterSchema,
  UserLoginSchema,
  GoogleLoginSchema,
} = require("../validator/auth-validator");
const prisma = require("../models/prisma");
const user_login = async (value) => {
  if (value.mobile) {
    const user = await prisma.users.findFirst({
      where: {
        mobile: value.mobile,
      },
    });
    return user;
  }

  if (value.email) {
    const user = await prisma.users.findFirst({
      where: {
        email: value.email,
      },
    });
    return user;
  }

  return null;
};

const check_role = async (req) => {
  const VENDOR = "vendor";

  if (req.user.role == VENDOR) {
    const user = await prisma.shopAccount.findUnique({
      where: {
        id: req.user.id,
      },
    });
    return user;
  }

  const user = await prisma.users.findFirst({
    where: {
      id: req.user.id,
    },
  });
  return user;
};
exports.getAuthUser = async (req, res, next) => {
  try {
    const user = await check_role(req);
    delete user.password;
    if (!user) return next(createError("user not found", 400));
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
exports.register = async (req, res, next) => {
  try {
    const { value, error } = UserRegisterSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    value.password = await bcrypt.hash(value.password, 10);
    const user = await prisma.users.create({
      data: value,
    });

    const payload = { userId: user.id, role: user.role };
    const accessToken = createToken(payload);
    delete user.password;
    res.status(201).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { value, error } = UserLoginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const user = await user_login(value);
    if (!user) {
      return next(createError("invalid Login", 400));
    }

    const compareMatch = await bcrypt.compare(value.password, user.password);
    if (!compareMatch) {
      return next(createError("invalid Login", 400));
    }
    const payload = { userId: user.id, role: user.role };
    const accessToken = createToken(payload);

    delete user.password;
    res.status(200).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { value, error } = GoogleLoginSchema.validate(req.body);
    if (error) return next(error);
    const existGoogleLogin = await prisma.users.findFirst({
      where: {
        googleId: value.googleId,
      },
    });
    if (existGoogleLogin) {
      const payload = {
        userId: existGoogleLogin.id,
        role: existGoogleLogin.role,
      };
      const accessToken = createToken(payload);
      let user = existGoogleLogin;
      return res.status(200).json({ accessToken, user });
    }
    const user = await prisma.users.create({
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

exports.loginLine = async (req, res, next) => {
  const { userId, displayName } = req.body;
  console.log(req.body);
  // const data = {
  //   name: userId
  // }

  try {
    const lineUser = await prisma.users.findFirst({
      where: {
        lineId: userId,
      },
    });
    if (!lineUser) {
      const user = await prisma.users.create({
        data: {
          lineId: userId,
          username: displayName,
        },
      });
      const payload = {
        lineId: user.lineId,
        role: user.role,
      };
      const accessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY || "qwertyuiop",
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );

      res.status(200).json({ accessToken });
    } else {
      const payload = {
        lineId: lineUser.lineId,
        role: lineUser.role,
      };
      const accessToken = createToken(payload);
      console.log(payload);
      res.status(200).json({ accessToken });
      // res.redirect('http://localhost:5173/register')
    }
  } catch (err) {
    next(err);
  }
};

// exports.test = async (req,res,next) => {
// try {
//   const { } = res.body

//   res.status(200).json({msg: 'hi'})
// } catch (err) {
//   next(err)
// }
// }
