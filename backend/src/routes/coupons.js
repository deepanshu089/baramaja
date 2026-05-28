const express = require('express');
const router = express.Router();
const { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllCoupons);
router.post('/', protect, createCoupon);
router.put('/:id', protect, updateCoupon);
router.delete('/:id', protect, deleteCoupon);
router.post('/validate', validateCoupon); // Public endpoint for checkout

module.exports = router;
