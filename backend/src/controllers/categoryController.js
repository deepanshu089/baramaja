const Category = require('../models/Category');

// GET /api/categories  (public)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ active: true }).populate('region').sort('sortOrder');
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/categories/admin/all  (admin)
const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().populate('region').sort('sortOrder');
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/categories  (admin)
const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category slug already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/categories/:id  (admin)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/categories/:id  (admin)
const deleteCategory = async (req, res) => {
  try {
    const Product = require('../models/Product');
    const count = await Product.countDocuments({ category: req.params.id });
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete — ${count} products are using this category`,
      });
    }
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCategories, getAllCategoriesAdmin, createCategory, updateCategory, deleteCategory };
