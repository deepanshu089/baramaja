const Product = require('../models/Product');

const buildFilter = (query) => {
  const filter = {};
  if (query.region) filter.region = query.region;
  if (query.category) filter.category = query.category;
  if (query.featured === 'true') filter.featured = true;
  if (!query.includeInactive) filter.active = true;
  return filter;
};

// GET /api/products  (public — supports ?region=id&category=id&featured=true)
const getProducts = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const products = await Product.find(filter)
      .populate('region', 'slug displayName themeColor')
      .populate('category', 'slug displayName')
      .sort({ sortOrder: 1, createdAt: -1 });

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:id  (public)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('region', 'slug displayName themeColor')
      .populate('category', 'slug displayName');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/products  (admin)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const populated = await product.populate(['region', 'category']);
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/products/:id  (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('region', 'slug displayName themeColor')
      .populate('category', 'slug displayName');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id  (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/products/:id/toggle-featured  (admin)
const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.featured = !product.featured;
    await product.save();
    res.json({ success: true, data: { _id: product._id, featured: product.featured } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/products/:id/toggle-active  (admin)
const toggleActive = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.active = !product.active;
    await product.save();
    res.json({ success: true, data: { _id: product._id, active: product.active } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/admin/stats  (admin — counts per region/category)
const getProductStats = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const active = await Product.countDocuments({ active: true });
    const featured = await Product.countDocuments({ featured: true });

    const byRegion = await Product.aggregate([
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $lookup: { from: 'regions', localField: '_id', foreignField: '_id', as: 'region' } },
      { $unwind: '$region' },
      { $project: { regionSlug: '$region.slug', regionName: '$region.displayName', count: 1 } },
    ]);

    const byCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $lookup: { from: 'regions', localField: 'category.region', foreignField: '_id', as: 'region' } },
      { $unwind: { path: '$region', preserveNullAndEmptyArrays: true } },
      { $project: { 
          categorySlug: '$category.slug', 
          categoryName: '$category.displayName', 
          regionSlug: '$region.slug',
          regionName: '$region.displayName',
          count: 1 
      }},
      { $sort: { regionSlug: 1, categoryName: 1 } }
    ]);

    res.json({ success: true, data: { total, active, featured, byRegion, byCategory } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  toggleActive,
  getProductStats,
};
