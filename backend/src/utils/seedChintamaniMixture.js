require('dotenv').config();
const connectDB = require('../config/db');
const Region = require('../models/Region');
const Category = require('../models/Category');
const Product = require('../models/Product');

const chintamaniMixture = [
  {
    name: 'Chintamani Special Mixture',
    description: 'A signature blend of crispy sev, peanuts, and roasted lentils tossed in aromatic Odia spices. The flagship Chintamani namkeen mixture.',
    image: 'https://images.unsplash.com/photo-1675081678327-25a9b6448977?q=80&w=1200&auto=format&fit=crop',
    price: 100, discountPrice: 85,
    rating: 4.7, ratingCount: 90, stock: 35, featured: true,
    weight: '200g', tags: ['Chintamani Mixture', 'Special', 'Odisha'],
  },
  {
    name: 'Chintamani Navratan Mixture',
    description: 'Nine-treasure crunchy mix of gram flour noodles, pulses, cornflakes, nuts, and raisins — wholesome and satisfying.',
    image: 'https://images.unsplash.com/photo-1620619795058-8388436cc01c?q=80&w=1200&auto=format&fit=crop',
    price: 110, discountPrice: 95,
    rating: 4.6, ratingCount: 75, stock: 30, featured: false,
    weight: '200g', tags: ['Chintamani Mixture', 'Navratan'],
  },
  {
    name: 'Chintamani Masala Mixture',
    description: 'Bold, spice-forward mixture loaded with masala-coated lentils and peanuts for a robust, punchy crunch.',
    image: 'https://images.unsplash.com/photo-1673702535620-5a105840040f?q=80&w=1200&auto=format&fit=crop',
    price: 105, discountPrice: 90,
    rating: 4.6, ratingCount: 65, stock: 30, featured: false,
    weight: '200g', tags: ['Chintamani Mixture', 'Masala'],
  },
  {
    name: 'Chintamani Bengali Chanachur',
    description: 'Classic Bengali-style chanachur with a balanced mix of crunch and spice, made the Chintamani way.',
    image: 'https://images.unsplash.com/photo-1675081548482-94dc75fe4f21?q=80&w=1200&auto=format&fit=crop',
    price: 95, discountPrice: 80,
    rating: 4.5, ratingCount: 60, stock: 35, featured: false,
    weight: '200g', tags: ['Chintamani Mixture', 'Bengali Chanachur'],
  },
  {
    name: 'Chintamani Spicy Mixture',
    description: 'An extra-fiery mixture for those who love serious heat — generously seasoned with chili and roasted spices.',
    image: 'https://images.unsplash.com/photo-1656639655048-9cffe08d506b?q=80&w=1200&auto=format&fit=crop',
    price: 100, discountPrice: 85,
    rating: 4.6, ratingCount: 55, stock: 30, featured: false,
    weight: '200g', tags: ['Chintamani Mixture', 'Spicy'],
  },
  {
    name: 'Chintamani Premium Mixture',
    description: 'An indulgent mixture upgraded with extra cashews, almonds, and premium lentils for a richer, more luxurious crunch.',
    image: 'https://images.unsplash.com/photo-1598371623789-44e341c1b6ab?q=80&w=1200&auto=format&fit=crop',
    price: 140, discountPrice: 120,
    rating: 4.8, ratingCount: 50, stock: 25, featured: true,
    weight: '200g', tags: ['Chintamani Mixture', 'Premium'],
  },
  {
    name: 'Chintamani Tea Time Mix',
    description: 'A light, savoury mix of gram flour noodles, peanuts, and green peas — the perfect evening tea companion.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop',
    price: 85, discountPrice: 70,
    rating: 4.5, ratingCount: 45, stock: 35, featured: false,
    weight: '200g', tags: ['Chintamani Mixture', 'Tea Time'],
  },
  {
    name: 'Chintamani Khatta Meetha Mix',
    description: 'A delightful tangy-sweet mixture that balances tamarind sourness with a hint of jaggery sweetness alongside the crunch.',
    image: 'https://images.unsplash.com/photo-1683533678059-63c6a0e9e3ef?q=80&w=1200&auto=format&fit=crop',
    price: 95, discountPrice: 80,
    rating: 4.6, ratingCount: 58, stock: 30, featured: false,
    weight: '200g', tags: ['Chintamani Mixture', 'Khatta Meetha'],
  },
  {
    name: 'Chintamani Dry Fruit Mixture',
    description: 'A nourishing mixture generously studded with cashews, almonds, and raisins for a wholesome, indulgent snack.',
    image: 'https://images.unsplash.com/photo-1683533678033-f5d60f0a3437?q=80&w=1200&auto=format&fit=crop',
    price: 150, discountPrice: 130,
    rating: 4.7, ratingCount: 42, stock: 25, featured: true,
    weight: '200g', tags: ['Chintamani Mixture', 'Dry Fruit'],
  },
  {
    name: 'Chintamani Hing Mixture',
    description: 'A digestive-friendly mixture seasoned with asafoetida (hing) and roasted jeera for a distinctive, aromatic flavour.',
    image: 'https://images.unsplash.com/photo-1717587052948-fb9825de50f8?q=80&w=1200&auto=format&fit=crop',
    price: 100, discountPrice: 85,
    rating: 4.5, ratingCount: 38, stock: 30, featured: false,
    weight: '200g', tags: ['Chintamani Mixture', 'Hing'],
  },
];

const run = async () => {
  try {
    await connectDB();

    const odisha = await Region.findOne({ slug: 'odisha' });
    if (!odisha) throw new Error('Odisha region not found. Run the main seed first.');

    const chintamaniCat = await Category.findOneAndUpdate(
      { slug: 'chintamani-mixture', region: odisha._id },
      {
        $setOnInsert: {
          slug: 'chintamani-mixture',
          region: odisha._id,
          displayName: 'Chintamani Mixture',
          odishaTitle: 'Chintamani Mixture & Namkeen',
          odishaSubtitle: 'CLASSIC MIXTURE PRODUCTS',
          sortOrder: 8,
        },
      },
      { upsert: true, new: true }
    );

    const names = chintamaniMixture.map(p => p.name);
    const removed = await Product.deleteMany({ name: { $in: names }, region: odisha._id });
    if (removed.deletedCount > 0) console.log(`Removed ${removed.deletedCount} existing Chintamani Mixture products before re-inserting.`);

    const docs = chintamaniMixture.map(p => ({
      ...p,
      region: odisha._id,
      category: chintamaniCat._id,
      active: true,
      sortOrder: 0,
    }));

    await Product.insertMany(docs);
    console.log(`✅ Inserted ${docs.length} Chintamani Mixture Odisha products successfully.`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
