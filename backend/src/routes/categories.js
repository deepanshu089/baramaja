const express = require('express');
const router = express.Router();
const { getCategories, getAllCategoriesAdmin, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/admin/all', protect, getAllCategoriesAdmin);
router.post('/', protect, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
