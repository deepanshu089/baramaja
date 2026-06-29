require('dotenv').config();
const connectDB = require('../config/db');
const Region = require('../models/Region');
const Category = require('../models/Category');
const Product = require('../models/Product');

const baromojaItems = [
  {
    name: 'Cuttack Barohmaja Mixture',
    description: 'The original twelve-in-one Cuttack street mixture — sev, peanuts, poha, and chips tossed in spicy Odia masala. The namesake snack behind Baromoja India.',
    image: 'https://baramaja.com/cdn/shop/files/JyotiMixturesSoecialChuda.webp?v=1768371102&width=1600',
    price: 120, discountPrice: 99,
    rating: 4.8, ratingCount: 140, stock: 40, featured: true,
    weight: '250g', tags: ['Baromoja', 'Cuttack Mixture', 'Bestseller'],
  },
  {
    name: 'Baromoja Special Chuda Mix',
    description: 'Jyoti Mixture style flattened-rice chuda blended with roasted nuts, sev, and curry leaves — a crunchy, tangy Odia tea-time classic.',
    image: '/images/baromoja-special-chuda.jpg',
    price: 110, discountPrice: 90,
    rating: 4.7, ratingCount: 95, stock: 35, featured: false,
    weight: '250g', tags: ['Baromoja', 'Chuda Mix', 'Tea-Time Snack'],
  },
];

const run = async () => {
  try {
    await connectDB();

    const odisha = await Region.findOne({ slug: 'odisha' });
    if (!odisha) throw new Error('Odisha region not found. Run the main seed first.');

    const baromojaCat = await Category.findOneAndUpdate(
      { slug: 'baromoja', region: odisha._id },
      {
        $setOnInsert: {
          slug: 'baromoja',
          region: odisha._id,
          displayName: 'Baromoja',
          odishaTitle: 'Baromoja — The Original Cuttack Mixture',
          odishaSubtitle: 'TWELVE-IN-ONE TRADITION',
          sortOrder: 7,
        },
      },
      { upsert: true, new: true }
    );

    const names = baromojaItems.map(p => p.name);
    const removed = await Product.deleteMany({ name: { $in: names }, region: odisha._id });
    if (removed.deletedCount > 0) console.log(`Removed ${removed.deletedCount} existing Baromoja products before re-inserting.`);

    const docs = baromojaItems.map(p => ({
      ...p,
      region: odisha._id,
      category: baromojaCat._id,
      active: true,
      sortOrder: 0,
    }));

    await Product.insertMany(docs);
    console.log(`✅ Inserted ${docs.length} Baromoja Odisha products successfully.`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
