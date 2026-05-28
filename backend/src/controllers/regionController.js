const Region = require('../models/Region');

// GET /api/regions  (public)
const getRegions = async (req, res) => {
  try {
    const regions = await Region.find({ active: true }).sort('sortOrder');
    res.json({ success: true, data: regions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/regions/:slug  (public)
const getRegionBySlug = async (req, res) => {
  try {
    const region = await Region.findOne({ slug: req.params.slug });
    if (!region) return res.status(404).json({ success: false, message: 'Region not found' });
    res.json({ success: true, data: region });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/regions/admin/all  (admin — includes inactive)
const getAllRegionsAdmin = async (req, res) => {
  try {
    const regions = await Region.find().sort('sortOrder');
    res.json({ success: true, data: regions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/regions/:id  (admin)
const updateRegion = async (req, res) => {
  try {
    const region = await Region.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!region) return res.status(404).json({ success: false, message: 'Region not found' });
    res.json({ success: true, data: region });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getRegions, getRegionBySlug, getAllRegionsAdmin, updateRegion };
