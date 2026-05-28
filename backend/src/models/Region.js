const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // 'odisha' | 'kolkata'
  displayName: { type: String, required: true },

  // Hero section content
  heroHeading: { type: String, default: '' },
  heroSubtitle: { type: String, default: '' },
  heroBadgeLabel: { type: String, default: '' },
  ctaPrimaryText: { type: String, default: 'Shop Now' },
  ctaSecondaryText: { type: String, default: 'Browse Products' },
  ctaSecondaryHref: { type: String, default: '#sweets' },
  bgImageUrl: { type: String, default: '' },
  themeColor: { type: String, enum: ['crimson', 'amber'], default: 'crimson' },

  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Region', regionSchema);
