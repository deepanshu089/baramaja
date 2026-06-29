require('dotenv').config();
const connectDB = require('../config/db');
const Region = require('../models/Region');
const Category = require('../models/Category');
const Product = require('../models/Product');

const ruchiMasalas = [
  {
    name: 'Ruchi Biryani Masala',
    description: 'Aromatic blend of whole spices crafted for rich, flavourful biryani every time.',
    image: 'https://static.wixstatic.com/media/55a0a9_e4dbfa67b71f4565ab6933d9608eb007~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    price: 90, discountPrice: 75,
    rating: 4.6, ratingCount: 80, stock: 40, featured: true,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Biryani'],
  },
  {
    name: 'Ruchi Chicken Masala',
    description: 'A robust spice mix designed to bring out the authentic taste of home-style chicken curry.',
    image: 'https://static.wixstatic.com/media/55a0a9_17ebd8c370d94ce0bdf8cf973637298a~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 85, discountPrice: 70,
    rating: 4.6, ratingCount: 95, stock: 40, featured: true,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Chicken'],
  },
  {
    name: 'Ruchi Meat Masala',
    description: 'A bold, full-bodied spice blend ideal for mutton and red meat curries.',
    image: 'https://static.wixstatic.com/media/55a0a9_98e2008ca6464d0eb2b711fa41506718~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    price: 90, discountPrice: 75,
    rating: 4.5, ratingCount: 60, stock: 35, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Meat'],
  },
  {
    name: 'Ruchi Egg Curry Masala',
    description: 'Specially balanced spice mix for a perfectly seasoned egg curry.',
    image: 'https://static.wixstatic.com/media/55a0a9_350577cdee104c9bbed642b7ba81063d~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    price: 75, discountPrice: 60,
    rating: 4.5, ratingCount: 50, stock: 35, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Egg Curry'],
  },
  {
    name: 'Ruchi Fish Masala',
    description: 'A tangy, fragrant spice blend tailored for classic Indian fish curries.',
    image: 'https://static.wixstatic.com/media/55a0a9_ef6744aa32f9458bb3780dedd1d9604d~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 85, discountPrice: 70,
    rating: 4.6, ratingCount: 70, stock: 35, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Fish'],
  },
  {
    name: 'Ruchi Garam Masala',
    description: 'The quintessential warm spice blend used to finish curries, dals, and gravies.',
    image: 'https://static.wixstatic.com/media/55a0a9_9331727afd854791aa0ffa249f377775~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    price: 70, discountPrice: 58,
    rating: 4.7, ratingCount: 110, stock: 45, featured: true,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Garam Masala'],
  },
  {
    name: 'Ruchi Chat Masala',
    description: 'A tangy, zesty seasoning perfect for chaats, fruits, and savoury snacks.',
    image: 'https://static.wixstatic.com/media/55a0a9_68df533d1a27447b90151046f832c7a9~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    price: 60, discountPrice: 50,
    rating: 4.6, ratingCount: 65, stock: 40, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Chat Masala'],
  },
  {
    name: 'Ruchi Kitchen King Masala',
    description: 'An all-purpose, richly aromatic spice mix that elevates vegetable and paneer dishes.',
    image: 'https://static.wixstatic.com/media/55a0a9_246191e784f545eaae7da4e8a6d40da4~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 80, discountPrice: 65,
    rating: 4.6, ratingCount: 55, stock: 35, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Kitchen King'],
  },
  {
    name: 'Ruchi Paneer Masala',
    description: 'A creamy, mildly spiced blend crafted specifically for restaurant-style paneer curries.',
    image: 'https://static.wixstatic.com/media/55a0a9_a3fead96beb1425ca05376c1319285d1~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    price: 80, discountPrice: 65,
    rating: 4.5, ratingCount: 45, stock: 35, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Paneer'],
  },
  {
    name: 'Ruchi Sambar Powder',
    description: 'A South Indian style lentil-and-spice blend for authentic sambar.',
    image: 'https://static.wixstatic.com/media/55a0a9_9dbd8f41c84c47569386d10b6ad1e1ec~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 70, discountPrice: 58,
    rating: 4.5, ratingCount: 40, stock: 30, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Sambar'],
  },
  {
    name: 'Ruchi Dum Aloo Masala',
    description: 'A rich, aromatic spice blend made for the classic Kashmiri-style dum aloo.',
    image: 'https://static.wixstatic.com/media/55a0a9_b37e7d03e82c4127a4ae88ba94c4e5fb~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 75, discountPrice: 62,
    rating: 4.5, ratingCount: 38, stock: 30, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Dum Aloo'],
  },
  {
    name: 'Ruchi Jaljeera',
    description: 'A refreshing tangy spice mix for the iconic Indian summer cooler, jaljeera.',
    image: 'https://static.wixstatic.com/media/55a0a9_eeae91fc746a4237ac5183ae9c1147fa~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    price: 65, discountPrice: 55,
    rating: 4.6, ratingCount: 48, stock: 35, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Jaljeera'],
  },
  {
    name: 'Ruchi Dalma Powder',
    description: 'A traditional Odia spice blend made specifically for the classic dal-vegetable dalma.',
    image: 'https://static.wixstatic.com/media/55a0a9_1df771ef77894c6f8e19975cfc42c283~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 70, discountPrice: 58,
    rating: 4.6, ratingCount: 52, stock: 30, featured: true,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Dalma', 'Odisha Special'],
  },
  {
    name: 'Ruchi Whole Biryani Masala',
    description: 'A whole-spice biryani blend retaining maximum aroma for a deeply fragrant biryani.',
    image: 'https://static.wixstatic.com/media/55a0a9_40ccaf92e1ce4c8b8ebc889b2f9432af~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 95, discountPrice: 80,
    rating: 4.7, ratingCount: 42, stock: 25, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Whole Biryani'],
  },
  {
    name: 'Ruchi Haldi Powder Special',
    description: 'Pure, vivid turmeric powder ground fresh for everyday cooking.',
    image: 'https://static.wixstatic.com/media/55a0a9_3d3587533b8d4e6abeaa79e9404e4c54~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    price: 50, discountPrice: 42,
    rating: 4.6, ratingCount: 70, stock: 50, featured: false,
    weight: '100g', tags: ['Ruchi', 'Spice', 'Haldi'],
  },
  {
    name: 'Ruchi Chilli Powder Special',
    description: 'Fiery, vibrant red chilli powder ground for everyday heat and colour.',
    image: 'https://static.wixstatic.com/media/55a0a9_4800726dcf9b4743ac32165c61f66be1~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 55, discountPrice: 45,
    rating: 4.6, ratingCount: 75, stock: 50, featured: false,
    weight: '100g', tags: ['Ruchi', 'Spice', 'Chilli'],
  },
  {
    name: 'Ruchi Dhania Powder Special',
    description: 'Freshly ground coriander powder for a mild, earthy base in everyday curries.',
    image: 'https://static.wixstatic.com/media/55a0a9_3ee48e9ede02430887ee1210f653b8b9~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 50, discountPrice: 42,
    rating: 4.5, ratingCount: 55, stock: 50, featured: false,
    weight: '100g', tags: ['Ruchi', 'Spice', 'Dhania'],
  },
  {
    name: 'Ruchi Jeera Powder Special',
    description: 'Roasted, finely ground cumin powder for everyday tempering and seasoning.',
    image: 'https://static.wixstatic.com/media/55a0a9_358f0efae9654839bc834cb2c26339ad~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    price: 60, discountPrice: 50,
    rating: 4.6, ratingCount: 58, stock: 45, featured: false,
    weight: '100g', tags: ['Ruchi', 'Spice', 'Jeera'],
  },
  {
    name: 'Ruchi Kashmiri Chilli Powder',
    description: 'Vivid, mild Kashmiri red chilli powder for rich colour without overpowering heat.',
    image: 'https://static.wixstatic.com/media/55a0a9_5058655ae0df461bb83fc34c099b1000~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 65, discountPrice: 55,
    rating: 4.7, ratingCount: 62, stock: 40, featured: true,
    weight: '100g', tags: ['Ruchi', 'Spice', 'Kashmiri Chilli'],
  },
  {
    name: 'Ruchi Curry Powder (Jar)',
    description: 'An all-purpose curry powder blend, packed in a convenient reusable jar.',
    image: 'https://static.wixstatic.com/media/55a0a9_925f3235c49f4ee4996411ac3ab7bf4c~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 90, discountPrice: 75,
    rating: 4.5, ratingCount: 36, stock: 30, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Curry Powder', 'Jar'],
  },
  {
    name: 'Ruchi Curry Powder (Pouch)',
    description: 'The same trusted all-purpose curry powder blend, in an economical refill pouch.',
    image: 'https://static.wixstatic.com/media/55a0a9_a7e575da4a114db6a30a987a520c7eb7~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 70, discountPrice: 58,
    rating: 4.5, ratingCount: 34, stock: 30, featured: false,
    weight: '100g', tags: ['Ruchi', 'Masala', 'Curry Powder', 'Pouch'],
  },
  {
    name: 'Ruchi Black Pepper Powder',
    description: 'Finely ground black pepper for everyday seasoning with a sharp, pungent kick.',
    image: 'https://static.wixstatic.com/media/55a0a9_e953ddd297954f429fa3d0abef138b6a~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    price: 75, discountPrice: 62,
    rating: 4.6, ratingCount: 48, stock: 35, featured: false,
    weight: '100g', tags: ['Ruchi', 'Spice', 'Black Pepper'],
  },
];

const run = async () => {
  try {
    await connectDB();

    const regionSlugs = ['odisha', 'kolkata'];

    for (const regionSlug of regionSlugs) {
      const region = await Region.findOne({ slug: regionSlug });
      if (!region) throw new Error(`${regionSlug} region not found. Run the main seed first.`);

      const masalaCat = await Category.findOne({ slug: 'masala', region: region._id });
      if (!masalaCat) throw new Error(`${regionSlug} masala category not found. Run the main seed first.`);

      const removed = await Product.deleteMany({ region: region._id, category: masalaCat._id });
      console.log(`Removed ${removed.deletedCount} existing ${regionSlug} masala products.`);

      const docs = ruchiMasalas.map(p => ({
        ...p,
        region: region._id,
        category: masalaCat._id,
        active: true,
        sortOrder: 0,
      }));

      await Product.insertMany(docs);
      console.log(`✅ Inserted ${docs.length} Ruchi masala products into ${regionSlug}.`);
    }

    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
