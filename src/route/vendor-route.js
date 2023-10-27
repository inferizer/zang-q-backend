const express = require("express");
const vendorController = require("../controllers/vendor-controller");

const router = express.Router();

router.post("/register", vendorController.register);

module.exports = router;
