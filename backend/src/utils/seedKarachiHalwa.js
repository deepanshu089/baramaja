require('dotenv').config();
const connectDB = require('../config/db');
const Region = require('../models/Region');
const Category = require('../models/Category');
const Product = require('../models/Product');

const karachiHalwa = [
  {
    name: 'Me Karodia Plain Karachi Halwa',
    description: 'The original Karachi Halwa from Me Karodia, Bara Bazar — a glossy, chewy cornstarch confection slow-cooked to a translucent finish and studded with nuts.',
    image: '/images/karachi-halwa-plain.jpg',
    price: 300, discountPrice: 300,
    rating: 4.8, ratingCount: 410, stock: 30, featured: true,
    weight: '1 kg', tags: ['Me Karodia', 'Karachi Halwa', 'Bestseller'],
  },
  {
    name: 'Me Karodia Mango Karachi Halwa',
    description: 'Classic chewy Karachi Halwa infused with sweet mango flavour, giving the traditional cornstarch confection a fruity, vibrant twist.',
    image: '/images/karachi-halwa-mango.jpg',
    price: 380, discountPrice: 380,
    rating: 4.7, ratingCount: 260, stock: 25, featured: true,
    weight: '1 kg', tags: ['Me Karodia', 'Karachi Halwa', 'Mango'],
  },
  {
    name: 'Me Karodia Pineapple Karachi Halwa',
    description: 'Glossy, chewy Karachi Halwa flavoured with tangy-sweet pineapple, a refreshing variant of the Bara Bazar classic.',
    image: '/images/karachi-halwa-pineapple.jpg',
    price: 380, discountPrice: 380,
    rating: 4.7, ratingCount: 210, stock: 25, featured: false,
    weight: '1 kg', tags: ['Me Karodia', 'Karachi Halwa', 'Pineapple'],
  },
  {
    name: 'Me Karodia Dry Fruit Halwa',
    description: 'Premium Karachi Halwa generously loaded with cashews, almonds, and pistachios for an extra rich, indulgent bite.',
    image: '/images/karachi-halwa-dry-fruit.jpg',
    price: 480, discountPrice: 480,
    rating: 4.9, ratingCount: 190, stock: 20, featured: true,
    weight: '1 kg', tags: ['Me Karodia', 'Karachi Halwa', 'Dry Fruits', 'Premium'],
  },
  {
    name: 'Me Karodia Aflatoon / Dry Fruit Halwa Bars',
    description: 'Bite-sized Karachi Halwa bars packed with dry fruits — a convenient, gift-ready take on the legendary Me Karodia recipe.',
    image: '/images/karachi-halwa-bars.jpg',
    price: 26, discountPrice: 26,
    rating: 4.6, ratingCount: 150, stock: 60, featured: false,
    weight: '1 piece', tags: ['Me Karodia', 'Karachi Halwa', 'Bars'],
  },
  {
    name: 'Me Karodia Plain Lacha Semai',
    description: 'Fine, crispy roasted vermicelli strands from Me Karodia — the classic base for Eid and festive semai preparations.',
    image: '/images/lacha-semai-plain.jpg',
    price: 180, discountPrice: 180,
    rating: 4.6, ratingCount: 120, stock: 40, featured: false,
    weight: '1 kg', tags: ['Me Karodia', 'Lacha Semai', 'Eid Special'],
  },
  {
    name: 'Me Karodia Roasted Lacha Semai',
    description: 'Golden, evenly roasted lacha semai with a deeper toasted aroma and flavour, ready for festive cooking.',
    image: '/images/lacha-semai-roasted.jpg',
    price: 220, discountPrice: 220,
    rating: 4.7, ratingCount: 95, stock: 35, featured: false,
    weight: '1 kg', tags: ['Me Karodia', 'Lacha Semai', 'Roasted'],
  },
  {
    name: 'Me Karodia Premium Desi Ghee Lacha Semai',
    description: 'Lacha semai roasted in pure desi ghee for a rich, aromatic flavour — a premium choice for special occasions.',
    image: '/images/lacha-semai-ghee.jpg',
    price: 320, discountPrice: 320,
    rating: 4.8, ratingCount: 80, stock: 25, featured: true,
    weight: '1 kg', tags: ['Me Karodia', 'Lacha Semai', 'Desi Ghee', 'Premium'],
  },
  {
    name: 'Me Karodia Dry Fruit Lacha Semai',
    description: 'Premium lacha semai loaded with chopped cashews, almonds, and pistachios for an indulgent festive treat.',
    image: '/images/lacha-semai-dry-fruit.jpg',
    price: 420, discountPrice: 420,
    rating: 4.9, ratingCount: 70, stock: 20, featured: true,
    weight: '1 kg', tags: ['Me Karodia', 'Lacha Semai', 'Dry Fruits', 'Premium'],
  },
];

const run = async () => {
  try {
    await connectDB();

    const kolkata = await Region.findOne({ slug: 'kolkata' });
    if (!kolkata) throw new Error('Kolkata region not found. Run the main seed first.');

    const halwaCat = await Category.findOneAndUpdate(
      { slug: 'karachi-halwa', region: kolkata._id },
      {
        $setOnInsert: {
          slug: 'karachi-halwa',
          region: kolkata._id,
          displayName: 'Karachi Halwa',
          kolkataTitle: 'Me Karodia Karachi Halwa',
          kolkataSubtitle: 'BARA BAZAR SPECIALTY',
          sortOrder: 9,
        },
      },
      { upsert: true, new: true }
    );

    // Remove existing Karachi Halwa products before re-inserting to allow safe re-runs
    const names = karachiHalwa.map(p => p.name);
    const removed = await Product.deleteMany({ name: { $in: names }, region: kolkata._id });
    if (removed.deletedCount > 0) console.log(`Removed ${removed.deletedCount} existing Karachi Halwa products before re-inserting.`);

    const docs = karachiHalwa.map(p => ({
      ...p,
      region: kolkata._id,
      category: halwaCat._id,
      active: true,
      sortOrder: 0,
    }));

    await Product.insertMany(docs);
    console.log(`✅ Inserted ${docs.length} Me Karodia Karachi Halwa products successfully.`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
