require('dotenv').config();
const connectDB = require('../config/db');
const Region = require('../models/Region');
const Category = require('../models/Category');
const Product = require('../models/Product');

const aflatunSweets = [
  {
    name: 'Aflatun Sweet',
    description: 'The classic Aflatun — a rich mawa-based sweet with a melt-in-mouth texture, freshly made every day. Pure happiness in every bite.',
    image: '/images/aflatun-sweet.jpg',
    price: 552, discountPrice: 480,
    rating: 4.9, ratingCount: 480, stock: 30, featured: true,
    weight: '1 kg', tags: ['Aflatun', 'Mawa', 'Bestseller'],
  },
  {
    name: 'Dry Fruit Aflatun',
    description: 'Premium Aflatun loaded with cashews, almonds, and pistachios. Rich mawa base studded with the finest dry fruits for an indulgent treat.',
    image: '/images/aflatun-dry-fruit.jpg',
    price: 782, discountPrice: 680,
    rating: 4.9, ratingCount: 310, stock: 20, featured: true,
    weight: '1 kg', tags: ['Aflatun', 'Dry Fruits', 'Premium'],
  },
  {
    name: 'Kesar Aflatun',
    description: 'Saffron-infused Aflatun with a golden hue and aromatic flavour. Rich mawa taste elevated with premium Kashmiri kesar.',
    image: '/images/aflatun-kesar.jpg',
    price: 713, discountPrice: 620,
    rating: 4.8, ratingCount: 270, stock: 22, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Kesar', 'Saffron'],
  },
  {
    name: 'Chocolate Aflatun',
    description: 'A modern twist on the classic — rich mawa Aflatun blended with premium cocoa for a delightful chocolate-meets-mithai experience.',
    image: '/images/aflatun-chocolate.jpg',
    price: 644, discountPrice: 560,
    rating: 4.7, ratingCount: 195, stock: 25, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Chocolate', 'Fusion'],
  },
  {
    name: 'Motichoor Laddu',
    description: 'Fine golden boondi spheres bound together with fragrant sugar syrup and cardamom. Soft, crumbly, and utterly classic.',
    image: '/images/motichoor-laddu.jpg',
    price: 414, discountPrice: 360,
    rating: 4.8, ratingCount: 530, stock: 35, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Laddu', 'Classic'],
  },
  {
    name: 'Besan Laddu',
    description: 'Roasted gram flour rounds slow-cooked in pure ghee with sugar and cardamom. A timeless homestyle sweet with deep nutty flavour.',
    image: '/images/besan-laddu.jpg',
    price: 391, discountPrice: 340,
    rating: 4.7, ratingCount: 420, stock: 40, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Besan', 'Ghee'],
  },
  {
    name: 'Milk Cake',
    description: 'Caramelised solid milk sweet with a distinctive grainy texture and rich brown hue. Made by slow-reducing whole milk with sugar.',
    image: '/images/milk-cake.jpg',
    price: 437, discountPrice: 380,
    rating: 4.8, ratingCount: 310, stock: 30, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Milk Cake', 'Rich'],
  },
  {
    name: 'Kalakand',
    description: 'Soft, moist milk cake made from freshly set paneer and condensed milk, garnished with pistachios. Crumbly and luscious.',
    image: '/images/kalakand.jpg',
    price: 483, discountPrice: 420,
    rating: 4.8, ratingCount: 280, stock: 28, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Kalakand', 'Paneer'],
  },
  {
    name: 'Soan Papdi',
    description: 'Airy, flaky threads of gram flour and sugar spun into melt-in-mouth layers, flavoured with cardamom and topped with pistachios.',
    image: '/images/soan-papdi.jpg',
    price: 276, discountPrice: 240,
    rating: 4.6, ratingCount: 390, stock: 50, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Soan Papdi', 'Flaky'],
  },
  {
    name: 'Dry Fruit Laddu',
    description: 'Wholesome laddus packed with chopped dates, figs, cashews, and almonds bound with minimal sugar. Nutrient-dense and naturally sweet.',
    image: '/images/dry-fruit-laddu.jpg',
    price: 782, discountPrice: 680,
    rating: 4.9, ratingCount: 210, stock: 20, featured: true,
    weight: '1 kg', tags: ['Aflatun', 'Dry Fruits', 'Healthy'],
  },
  {
    name: 'Anjeer Barfi',
    description: 'Fig-based barfi blended with khoya and dry fruits. Naturally sweet, dense, and deeply flavourful with the richness of premium figs.',
    image: '/images/anjeer-barfi.jpg',
    price: 943, discountPrice: 820,
    rating: 4.8, ratingCount: 175, stock: 18, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Anjeer', 'Fig'],
  },
  {
    name: 'Pista Roll',
    description: 'Vibrant green rolls made from finely ground pistachios and sugar, wrapped in a thin silver-leaf shell. Luxuriously nutty and elegant.',
    image: '/images/pista-roll.jpg',
    price: 1035, discountPrice: 900,
    rating: 4.9, ratingCount: 230, stock: 15, featured: true,
    weight: '1 kg', tags: ['Aflatun', 'Pista', 'Premium'],
  },
  {
    name: 'Chocolate Barfi',
    description: 'Khoya and cocoa combined into smooth, fudgy squares with a rich chocolatey finish. A crowd favourite for those who love fusion mithai.',
    image: '/images/chocolate-barfi.jpg',
    price: 598, discountPrice: 520,
    rating: 4.7, ratingCount: 290, stock: 25, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Chocolate', 'Barfi'],
  },
  {
    name: 'Rajbhog',
    description: 'Large saffron-tinted chhena balls stuffed with nuts, soaked in fragrant sugar syrup. A regal sweet for special occasions.',
    image: '/images/rajbhog.jpg',
    price: 391, discountPrice: 340,
    rating: 4.8, ratingCount: 360, stock: 30, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Rajbhog', 'Stuffed'],
  },
  {
    name: 'Cham Cham',
    description: 'Soft oval chhena sweets rolled in desiccated coconut or mawa and filled with sweet cream. A Bengali classic made fresh daily.',
    image: '/images/cham-cham.jpg',
    price: 368, discountPrice: 320,
    rating: 4.7, ratingCount: 320, stock: 32, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Cham Cham', 'Bengali'],
  },
  {
    name: 'Kesar Peda',
    description: 'Velvety khoya rounds infused with saffron and cardamom, decorated with a pistachio sliver. Fragrant, rich, and melt-in-mouth.',
    image: '/images/kesar-peda.jpg',
    price: 529, discountPrice: 460,
    rating: 4.8, ratingCount: 410, stock: 28, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Peda', 'Kesar'],
  },
  {
    name: 'Coconut Barfi',
    description: 'Fresh grated coconut slow-cooked with sugar and cardamom into firm, aromatic squares. Simple, clean, and irresistibly fragrant.',
    image: '/images/coconut-barfi.jpg',
    price: 414, discountPrice: 360,
    rating: 4.7, ratingCount: 270, stock: 35, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Coconut', 'Barfi'],
  },
  {
    name: 'Gujiya',
    description: 'Deep-fried crescent pastries stuffed with khoya, sugar, and dry fruits. A festive favourite, crisp outside and richly sweet inside.',
    image: '/images/gujiya.jpg',
    price: 713, discountPrice: 620,
    rating: 4.8, ratingCount: 340, stock: 20, featured: false,
    weight: '1 kg', tags: ['Aflatun', 'Gujiya', 'Festive'],
  },
  {
    name: 'Kaju Roll',
    description: 'Smooth cashew fudge shaped into elegant rolls and wrapped in edible silver leaf. A luxurious dry sweet perfect for gifting.',
    image: '/images/kaju-roll.jpg',
    price: 661, discountPrice: 575,
    rating: 4.9, ratingCount: 490, stock: 22, featured: true,
    weight: '1 kg', tags: ['Aflatun', 'Kaju', 'Gift'],
  },
  {
    name: 'Badam Katli',
    description: 'Ultra-thin, smooth almond fudge sheets with a delicate flavour and silky texture. A premium dry sweet made with the finest almonds.',
    image: '/images/badam-katli.jpg',
    price: 1434, discountPrice: 1247,
    rating: 4.9, ratingCount: 280, stock: 15, featured: true,
    weight: '1 kg', tags: ['Aflatun', 'Badam', 'Premium'],
  },
];

const run = async () => {
  try {
    await connectDB();

    const kolkata = await Region.findOne({ slug: 'kolkata' });
    if (!kolkata) throw new Error('Kolkata region not found. Run the main seed first.');

    const sweetsCat = await Category.findOne({ slug: 'mithai', region: kolkata._id });
    if (!sweetsCat) throw new Error('Kolkata mithai category not found. Run the main seed first.');

    // Remove existing Aflatun products before re-inserting to allow safe re-runs
    const names = aflatunSweets.map(p => p.name);
    const removed = await Product.deleteMany({ name: { $in: names }, region: kolkata._id });
    if (removed.deletedCount > 0) console.log(`Removed ${removed.deletedCount} existing Aflatun products before re-inserting.`);

    const docs = aflatunSweets.map(p => ({
      ...p,
      region: kolkata._id,
      category: sweetsCat._id,
      active: true,
      sortOrder: 0,
    }));

    await Product.insertMany(docs);
    console.log(`✅ Inserted ${docs.length} Aflatun Kolkata sweets successfully.`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
