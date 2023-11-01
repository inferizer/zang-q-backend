const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const authController = require("../controllers/auth-controller");

const router = express.Router();

//get authenticate
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/login",
  (req, res, next) => {
    console.log(passport, "passport");
    next();
  },

  isLoggedIn,
  authController.login
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/",
    failureRedirect: "/auth/google/failure",
  })
);

router.get("/auth/google/failure", (req, res, next) => {
  res.sendStatus("Failed to authenticate..");
});

module.exports = router;
