const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus, getOrderStats } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', createOrder);                            // public — from checkout
router.get('/', protect, getOrders);                      // admin
router.get('/stats', protect, getOrderStats);             // admin
router.get('/:id', protect, getOrderById);                // admin
router.patch('/:id/status', protect, updateOrderStatus);  // admin

module.exports = router;
