const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'editor'], default: 'editor' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// Never return passwordHash in JSON responses
adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

adminSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

adminSchema.statics.hashPassword = async function (plain) {
  return bcrypt.hash(plain, 12);
};

module.exports = mongoose.model('Admin', adminSchema);
