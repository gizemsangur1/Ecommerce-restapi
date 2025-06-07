const Order = require("../models/Order");
const Product = require("../models/Product");
const sendEmail = require("../utils/mailSender"); 

const notifyLowStock = async (product) => {
  const subject = `Low Stock Alert: ${product.name}`;
  const text = `Attention! The stock for product "${product.name}" is low. Only ${product.stock} left in stock. Please restock soon.`;
  
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL, 
      subject,
      text,
      html: `<p>${text}</p>`
    });
    console.log(`Low stock alert email sent for product: ${product.name}`);
  } catch (error) {
    console.error("Failed to send low stock email:", error);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Sipariş öğeleri boş olamaz." });
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product with id ${item.product} not found.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Product ${product.name} stokta yetersiz.` });
      }

      product.stock -= item.quantity;
      await product.save();

      if (product.stock <= product.stockThreshold) {
        await notifyLowStock(product);
      }
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
    const order = await Order.findById(req.params.id).populate("user", "email name");
    if (!order) return res.status(404).json({ message: "Sipariş bulunamadı" });

    order.status = req.body.status || order.status;

    const updated = await order.save();

    await sendEmail({
      to: order.user.email,
      subject: `Your order #${order._id} status updated`,
      text: `Hello ${order.user.name}, your order status is now: ${order.status}.`,
      html: `<p>Hello <strong>${order.user.name}</strong>,</p>
             <p>Your order status is now: <strong>${order.status}</strong>.</p>`,
    });

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

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Sipariş bulunamadı" });

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Sipariş zaten iptal edilmiş." });
    }

    order.status = "Cancelled";

    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.quantity;  
        await product.save();
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Sipariş iptali başarısız", error: error.message });
  }
};

exports.addShippingInfo = async (req, res) => {
  try {
    const { trackingNumber, carrier } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Sipariş bulunamadı" });

    order.trackingNumber = trackingNumber;
    order.carrier = carrier;
    order.status = "Shipped";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Kargo bilgisi eklenemedi", error: error.message });
  }
};
