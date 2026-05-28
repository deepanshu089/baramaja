const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },

  // Hierarchy refs
  region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  weight: { type: String, required: true },
  tags: [{ type: String, trim: true }],
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

// Indexes for fast querying by region + category
productSchema.index({ region: 1, category: 1 });
productSchema.index({ active: 1 });
productSchema.index({ featured: 1 });

module.exports = mongoose.model('Product', productSchema);
