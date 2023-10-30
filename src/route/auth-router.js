const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const passport = require("passport");
const prisma = require("../models/prisma");

const router = express.Router();

//get authenticate
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/protected", isLoggedIn, async (req, res, next) => {
  const user = await prisma.users.upsert({
    update: {
      email: req.user.email,
    },
    where: {
      email: req.user.email,
    },
    create: {
      email: req.user.email,
    },
  });

  res.send(user);
  console.log(req.user);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/google/failure",
  })
);

router.get("/logout", (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.sendStatus(200);
});

router.get("/auth/google/failure", (req, res, next) => {
  res.send("Failed to authenticate..");
});

module.exports = router;
