const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const Authenticate = require("../middlewares/Authenticate");

router.post("/register", adminController.register);
router.post("/login", Authenticate, adminController.login);
router.get("/find_all_shop", Authenticate, adminController.find_All_Shop);
router.post("/pending", Authenticate, adminController.approvedApplication);
router.delete("/pending/:id", Authenticate, adminController.rejectApplication);
router.get(
  "/pending",
  Authenticate,
  adminController.getAllPendingShopApplication
);
router.get("/category", Authenticate, adminController.getAllCategory);
router.post("/category", Authenticate, adminController.createCategory);
router.patch("/category", Authenticate, adminController.updateCategory);
router.delete("/category/:id", Authenticate, adminController.deleteCategory);

module.exports = router;
