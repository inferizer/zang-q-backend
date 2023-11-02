const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticate = require('../middlewares/Authenticate')

const router = express.Router();

router.get('/',authenticate,authController.getAuthUser)
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/loginLine',authController.loginLine)


module.exports = router;
