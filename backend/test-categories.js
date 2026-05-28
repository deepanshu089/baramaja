require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');
const Region = require('./src/models/Region');

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const categories = await Category.find().populate('region');
    console.log('--- ALL CATEGORIES IN DB ---');
    categories.forEach(c => {
      console.log(`Name: ${c.displayName}, Slug: ${c.slug}, Region: ${c.region?.slug} (ID: ${c.region?._id}), Active: ${c.active}`);
    });
    const regions = await Region.find();
    console.log('--- ALL REGIONS IN DB ---');
    regions.forEach(r => {
      console.log(`Slug: ${r.slug}, ID: ${r._id}`);
    });
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

test();
