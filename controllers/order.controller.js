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
    const orders = await Order.find({}).populate("user", "name email").populate("orderItems.product", "name price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Siparişler getirilemedi", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı." });
    }

    order.status = status || order.status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Sipariş durumu güncellenemedi", error: error.message });
  }
};
