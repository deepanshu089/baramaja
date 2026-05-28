const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  toggleActive,
  getProductStats,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/admin/stats', protect, getProductStats);
router.get('/:id', getProductById);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.patch('/:id/toggle-featured', protect, toggleFeatured);
router.patch('/:id/toggle-active', protect, toggleActive);

module.exports = router;
