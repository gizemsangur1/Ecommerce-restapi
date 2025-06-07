const Order = require("../models/Order");

exports.getOrdersReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      status: { $ne: "Cancelled" },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.json({
      totalOrders,
      totalRevenue,
      startDate,
      endDate,
    });
  } catch (error) {
    res.status(500).json({ message: "Report generation failed", error: error.message });
  }
};
