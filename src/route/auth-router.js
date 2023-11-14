const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticate = require('../middlewares/Authenticate')
const upload_middleware = require("../middlewares/multer");

const router = express.Router();

router.get('/',authenticate,authController.getAuthUser)
router.post("/register", authController.register);
router.post("/login", authController.login)
router.post('/login/google', authController.googleLogin)
router.post('/loginLine',authController.loginLine)
router.put('/edit/:id',authenticate,upload_middleware.single('profileImage'),authController.editUser)


module.exports = router;
