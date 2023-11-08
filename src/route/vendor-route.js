const express = require("express");
const authenticate = require("../middlewares/Authenticate");
const upload_middleware = require("../middlewares/multer");
const vendorController = require("../controllers/vendor-controller");
const router = express.Router();

router.post("/register", vendorController.register);
router.post("/login", vendorController.login);
router.post(
  "/application",
  authenticate,
  upload_middleware.fields([
    { name: "shopPicture", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
  ]),
  vendorController.application
);
router.get("/category", vendorController.getAllCategory);
router.post("/category/:shopsId", authenticate, vendorController.addVendorCategory);

module.exports = router;
