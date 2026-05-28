const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  slug: { type: String, required: true, lowercase: true, trim: true }, // 'sweets' | 'snacks' | 'masala' | 'pickles' | 'healthy'
  region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },
  displayName: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' }, // emoji or icon name
  odishaTitle: { type: String, default: '' },
  odishaSubtitle: { type: String, default: '' },
  kolkataTitle: { type: String, default: '' },
  kolkataSubtitle: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
