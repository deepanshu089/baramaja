require('dotenv').config();
const connectDB = require('../config/db');
const Region = require('../models/Region');
const Category = require('../models/Category');
const Product = require('../models/Product');

const namasteChanachur = [
  {
    name: 'Namaste Jhal Chanachur',
    description: 'Fiery, spice-loaded Bengali chanachur mix with a sharp jhal kick — a Namaste Chanachur popular favourite.',
    image: 'https://www.mukharochak.com/admin/public/images/1715853176_chanachur4.webp',
    price: 90, discountPrice: 80,
    rating: 4.6, ratingCount: 110, stock: 40, featured: true,
    weight: '200g', tags: ['Namaste Chanachur', 'Jhal', 'Spicy'],
  },
  {
    name: 'Namaste Tok Jhal Mishti Chanachur',
    description: 'The classic tangy-spicy-sweet Bengali chanachur blend, balancing tamarind tang, chili heat, and a touch of sweetness in every bite.',
    image: 'https://amarchanachur.in/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-16-at-11.10.00-AM-300x300.jpeg',
    price: 90, discountPrice: 80,
    rating: 4.7, ratingCount: 130, stock: 40, featured: true,
    weight: '200g', tags: ['Namaste Chanachur', 'Tok Jhal Mishti'],
  },
  {
    name: 'Namaste Masala Mixture',
    description: 'A hearty namkeen mixture loaded with spiced lentils, peanuts, and rice flakes for a robust masala crunch.',
    image: 'https://www.bikaji.com/pub/media/catalog/product/cache/2765542505660baab28ecd555e27366e/0/9/09_-front_-shahi-mixture-domestic_350gm_-size-w-448-pxl-x-h-560-pxl.png',
    price: 100, discountPrice: 85,
    rating: 4.5, ratingCount: 85, stock: 35, featured: false,
    weight: '200g', tags: ['Namaste Chanachur', 'Masala Mixture'],
  },
  {
    name: 'Namaste Navratan Mix',
    description: 'A nine-treasure blend of gram flour noodles, pulses, cornflakes, nuts, and raisins for a wholesome crunchy snack.',
    image: 'https://www.bikaji.com/pub/media/catalog/product/s/u/sub-kuch-domestic_1kg_fop.png',
    price: 110, discountPrice: 95,
    rating: 4.6, ratingCount: 90, stock: 30, featured: false,
    weight: '200g', tags: ['Namaste Chanachur', 'Navratan Mix'],
  },
  {
    name: 'Namaste Bhujia',
    description: 'Fine, crispy gram-flour noodles seasoned with traditional spices — a classic crunchy namkeen staple.',
    image: 'https://www.bikaji.com/pub/media/catalog/product/cache/2765542505660baab28ecd555e27366e/b/i/bikaneri-bhujia-domestic_1kg_fop.png',
    price: 95, discountPrice: 80,
    rating: 4.6, ratingCount: 120, stock: 40, featured: false,
    weight: '200g', tags: ['Namaste Chanachur', 'Bhujia'],
  },
  {
    name: 'Namaste Diet Chira Mix',
    description: 'A lighter flattened-rice (chira) based mixture, roasted instead of fried, for a guilt-free crunchy snack.',
    image: 'https://amarchanachur.in/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-27-at-3.50.29-PM-300x300.jpeg',
    price: 90, discountPrice: 75,
    rating: 4.5, ratingCount: 70, stock: 30, featured: false,
    weight: '200g', tags: ['Namaste Chanachur', 'Diet Chira', 'Light'],
  },
  {
    name: 'Namaste Spicy Chanachur',
    description: 'An extra-hot variant of the classic chanachur mix, packed with fiery chili and roasted spices for heat-seekers.',
    image: 'https://amarchanachur.in/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-27-at-3.50.26-PM-300x300.jpeg',
    price: 90, discountPrice: 80,
    rating: 4.6, ratingCount: 100, stock: 35, featured: false,
    weight: '200g', tags: ['Namaste Chanachur', 'Spicy'],
  },
  {
    name: 'Namaste Badam Mix',
    description: 'A rich mix of fried potato sticks, cashews, almonds, and golden raisins — an indulgent dry-fruit namkeen.',
    image: 'https://www.bikaji.com/pub/media/catalog/product/cache/2765542505660baab28ecd555e27366e/0/7/07_-front_-kaju-kismis-mix-domestic_350gm_-size-w-448-pxl-x-h-560-pxl.png',
    price: 150, discountPrice: 130,
    rating: 4.7, ratingCount: 60, stock: 25, featured: true,
    weight: '200g', tags: ['Namaste Chanachur', 'Badam Mix', 'Premium'],
  },
  {
    name: 'Namaste Cornflakes Mixture',
    description: 'Crispy cornflakes and cashews seasoned with aromatic spices for a unique crunchy namkeen experience.',
    image: 'https://www.bikaji.com/pub/media/catalog/product/cache/2765542505660baab28ecd555e27366e/m/a/mastkin_350g-domestic_fop.png',
    price: 105, discountPrice: 90,
    rating: 4.5, ratingCount: 65, stock: 30, featured: false,
    weight: '200g', tags: ['Namaste Chanachur', 'Cornflakes Mixture'],
  },
  {
    name: 'Namaste Bengali Namkeen',
    description: 'An assortment of traditional Bengali-style fried namkeen pieces, golden and crunchy with a mild spice profile.',
    image: 'https://amarchanachur.in/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-27-at-3.50.27-PM-1-300x300.jpeg',
    price: 95, discountPrice: 80,
    rating: 4.6, ratingCount: 75, stock: 30, featured: false,
    weight: '200g', tags: ['Namaste Chanachur', 'Bengali Namkeen'],
  },
  {
    name: 'Namaste Tea-Time Snacks',
    description: 'A light, savoury crunchy mix of gram flour noodles, peanuts, and green peas — the perfect companion for evening tea.',
    image: 'https://www.bikaji.com/pub/media/catalog/product/cache/2765542505660baab28ecd555e27366e/1/1/11_-new-bombay-mix_175-x-235-x-70-mm_200g-final_-fop.png',
    price: 85, discountPrice: 70,
    rating: 4.5, ratingCount: 55, stock: 35, featured: false,
    weight: '200g', tags: ['Namaste Chanachur', 'Tea-Time Snacks'],
  },
];

const run = async () => {
  try {
    await connectDB();

    const kolkata = await Region.findOne({ slug: 'kolkata' });
    if (!kolkata) throw new Error('Kolkata region not found. Run the main seed first.');

    const namasteCat = await Category.findOneAndUpdate(
      { slug: 'namaste-chanachur', region: kolkata._id },
      {
        $setOnInsert: {
          slug: 'namaste-chanachur',
          region: kolkata._id,
          displayName: 'Namaste Chanachur',
          kolkataTitle: 'Namaste Chanachur Popular Products',
          kolkataSubtitle: 'BENGALI NAMKEEN & MIXTURES',
          sortOrder: 10,
        },
      },
      { upsert: true, new: true }
    );

    const names = namasteChanachur.map(p => p.name);
    const removed = await Product.deleteMany({ name: { $in: names }, region: kolkata._id });
    if (removed.deletedCount > 0) console.log(`Removed ${removed.deletedCount} existing Namaste Chanachur products before re-inserting.`);

    const docs = namasteChanachur.map(p => ({
      ...p,
      region: kolkata._id,
      category: namasteCat._id,
      active: true,
      sortOrder: 0,
    }));

    await Product.insertMany(docs);
    console.log(`✅ Inserted ${docs.length} Namaste Chanachur Kolkata products successfully.`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
