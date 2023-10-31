const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const Authenticate = require("../middlewares/Authenticate");

router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.get('/q',Authenticate, adminController.getAdmin)

module.exports = router;
