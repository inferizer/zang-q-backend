const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const authenticate = require("../middlewares/authenticate");

router.post("/register",  adminController.register);
router.post("/login",  adminController.login);
router.get("/find_all_shop", authenticate, adminController.find_All_Shop);
router.post("/approved", authenticate, adminController.approvedApplication);
router.delete("/pending/:id", authenticate, adminController.rejectApplication);
router.get(
  "/pending",
  authenticate,
  adminController.getAllPendingShopApplication
);
router.get(
  "/approved/list",
  authenticate,
  adminController.getAllApprovedShopApplication
);
router.get("/category", authenticate, adminController.getAllCategory);
router.post("/category", authenticate, adminController.createCategory);
router.patch("/category", authenticate, adminController.updateCategory);
router.delete("/category/:id", authenticate, adminController.deleteCategory);

module.exports = router;
