const SiteConfig = require('../models/SiteConfig');

// GET /api/config  (public)
const getConfig = async (req, res) => {
  try {
    const configs = await SiteConfig.find();
    // Return as flat object: { siteName: '...', tagline: '...' }
    const result = {};
    configs.forEach((c) => { result[c.key] = c.value; });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/config  (admin — upsert by key)
const updateConfig = async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ success: false, message: 'key is required' });

    const config = await SiteConfig.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/config/bulk  (admin — update multiple keys at once)
const updateConfigBulk = async (req, res) => {
  try {
    const updates = req.body; // { key1: value1, key2: value2 }
    const ops = Object.entries(updates).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { key, value } },
        upsert: true,
      },
    }));
    await SiteConfig.bulkWrite(ops);
    res.json({ success: true, message: 'Config updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getConfig, updateConfig, updateConfigBulk };
