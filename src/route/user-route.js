const express = require("express");
const userController = require("../controllers/user-controller");
const router = express.Router();
router.post("/reservate", userController.resevation);
router.delete("/cancel_reservate/:id", userController.cancel_reservate);
router.get("/all_shop", userController.getAllApproveUserApplication);
router.get("/shop", userController.getallShop);
router.get("/category", userController.getallCategory);

module.exports = router;
