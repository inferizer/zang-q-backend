const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticate = require('../middlewares/Authenticate')

const router = express.Router();

router.get('/',authenticate,authController.getAuthUser)
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/login/line',authController.lineLogin)
router.post('/login/google', authController.googleLogin)

module.exports = router;
