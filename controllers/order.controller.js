const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Sipariş öğeleri boş olamaz." });
    }

    const order = await Order.create({
      user: req.user.id, 
      orderItems,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Sipariş oluşturulamadı", error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("orderItems.product", "name price image");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Siparişler getirilemedi", error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Tüm siparişler alınamadı", error: error.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Sipariş bulunamadı" });

    order.status = req.body.status || order.status;

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Durum güncellenemedi", error: error.message });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to get order", error: error.message });
  }
};

exports.markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Sipariş bulunamadı" });

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Ödeme durumu güncellenemedi", error: error.message });
  }
};
