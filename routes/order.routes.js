const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  markOrderAsPaid,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/order.controller");

const { protect, admin } = require("../middleware/auth.middleware");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getUserOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, markOrderAsPaid);

router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
