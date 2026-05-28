const Order = require('../models/Order');

// POST /api/orders  (public — called from checkout)
const createOrder = async (req, res) => {
  try {
    const { items, customer, paymentMethod, subtotal, deliveryFee, grandTotal } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item' });
    }

    const order = await Order.create({
      items,
      customer,
      paymentMethod,
      subtotal,
      deliveryFee,
      grandTotal,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending',
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/orders  (admin)
const getOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.orderStatus = req.query.status;
    if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:id  (admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/orders/:id/status  (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/stats  (admin)
const getOrderStats = async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const pending = await Order.countDocuments({ orderStatus: 'pending' });
    const delivered = await Order.countDocuments({ orderStatus: 'delivered' });

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$grandTotal' } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    res.json({ success: true, data: { total, pending, delivered, revenue } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, getOrderStats };
