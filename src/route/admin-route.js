const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const Authenticate = require("../middlewares/Authenticate");

router.post("/register",Authenticate, adminController.register);
router.post("/login", Authenticate, adminController.login);
router.get('/find_all_shop', Authenticate, adminController.find_All_Shop)
router.post('/approved',Authenticate,adminController.approvedApplication)
router.get('/pending',Authenticate,adminController.getAllPendingShopApplication)

module.exports = router;
