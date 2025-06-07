const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { protect, admin } = require("../middleware/auth.middleware");

router.post("/", protect, orderController.createOrder);

router.get("/myorders", protect, orderController.getUserOrders);

router.get("/", protect, admin, orderController.getAllOrders);

router.put("/:id/status", protect, admin, orderController.updateOrderStatus);

module.exports = router;
