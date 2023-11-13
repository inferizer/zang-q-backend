const express = require("express");
const authenticate = require("../middlewares/authenticate");
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
router.post(
  "/category/:shopsId",
  authenticate,
  vendorController.addVendorCategory
);
router.get("/findallshop", authenticate, vendorController.findResevation);
router.get("/getMyShop", authenticate, vendorController.getMyShop);
router.patch("/accept", vendorController.approveResevation);
router.patch("/canceled", vendorController.rejectedResevation);
router.patch("/close", authenticate, vendorController.closeQueue);
module.exports = router;
