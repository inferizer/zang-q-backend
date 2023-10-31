const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { authController } = require("../controllers/admin-controller");

const router = express.Router();

//get authenticate
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/me", passport.authenticate, isLoggedIn.getMe);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/me",
    failureRedirect: "/auth/google/failure",
  })
);

router.get("/auth/google/failure", (req, res, next) => {
  res.sendStatus("Failed to authenticate..");
});

module.exports = router;
