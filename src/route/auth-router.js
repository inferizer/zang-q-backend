const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticate = require('../middlewares/Authenticate')

const router = express.Router();

router.get('/',authenticate,authController.getAuthUser)
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/loginLine',authController.loginLine)
router.post('/LineTest',authController.test)

module.exports = router;
