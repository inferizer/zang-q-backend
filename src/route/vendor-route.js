const express = require("express");
const vendorController = require("../controllers/vendor-controller");

const router = express.Router();

router.post("/register", vendorController.register);
router.post("/login", vendorController.login)

module.exports = router;
