const express = require("express");
const authenticate = require("../middlewares/Authenticate");
const userController = require('../controllers/user-controller')
const router = express.Router();
router.get("/shop",userController.getallShop)
router.get('/category',userController.getallCategory)


module.exports = router;
