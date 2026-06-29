require('dotenv').config();
const connectDB = require('../config/db');
const Region = require('../models/Region');
const Category = require('../models/Category');
const Product = require('../models/Product');

const kcDasSweets = [
  {
    id: 'ko-sweet-9',
    name: 'KC Das Rasogulla',
    description: 'Classic soft and spongy chhena balls soaked in light sugar syrup. The original Bengali Rasogulla as made famous by KC Das, Kolkata.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/rasgulla-min.jpg',
    price: 32,
    discountPrice: 24,
    rating: 4.9,
    ratingCount: 820,
    stock: 50,
    featured: true,
    weight: '1 piece',
    tags: ['KC Das', 'Classic', 'Bestseller'],
  },
  {
    id: 'ko-sweet-10',
    name: 'KC Das Rajbhog',
    description: 'A regal, saffron-tinted larger chhena ball stuffed with nuts and dry fruits, soaked in aromatic sugar syrup. A royal treat from KC Das.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/rajbhog-min.jpg',
    price: 46,
    discountPrice: 34,
    rating: 4.9,
    ratingCount: 540,
    stock: 40,
    featured: true,
    weight: '1 piece',
    tags: ['KC Das', 'Stuffed', 'Premium'],
  },
  {
    id: 'ko-sweet-11',
    name: 'KC Das Strawberry Rossogolla',
    description: 'Tender chhena dumplings infused with natural strawberry flavour, soaked in a delicate strawberry-kissed sugar syrup.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/strawberry-rasgulla-min.jpg',
    price: 32,
    discountPrice: 24,
    rating: 4.7,
    ratingCount: 310,
    stock: 35,
    featured: false,
    weight: '1 piece',
    tags: ['KC Das', 'Strawberry', 'Fusion'],
  },
  {
    id: 'ko-sweet-12',
    name: 'KC Das Kalakand Special',
    description: 'Rich, grainy milk cake made from reduced whole milk and sugar, garnished with pistachios. A dense and indulgent KC Das specialty.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/kalakand-min.jpg',
    price: 37,
    discountPrice: 27,
    rating: 4.8,
    ratingCount: 275,
    stock: 30,
    featured: false,
    weight: '1 piece',
    tags: ['KC Das', 'Milk Cake', 'Rich'],
  },
  {
    id: 'ko-sweet-13',
    name: 'KC Das Rasmalai',
    description: "Flat, soft chhena patties soaked in thickened, saffron-and-cardamom-spiced chilled milk. One of KC Das's most celebrated signature sweets.",
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/rasmalai-min.jpg',
    price: 88,
    discountPrice: 65,
    rating: 5.0,
    ratingCount: 960,
    stock: 25,
    featured: true,
    weight: '1 piece',
    tags: ['KC Das', 'Legendary', 'Saffron'],
  },
  {
    id: 'ko-sweet-14',
    name: 'KC Das Cham Cham',
    description: 'Elongated, firm chhena sweets coated with mawa or coconut and filled with a soft sweet cream. A traditional Bengali mithai with delightful texture.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/chamcham-min.jpg',
    price: 70,
    discountPrice: 52,
    rating: 4.8,
    ratingCount: 390,
    stock: 30,
    featured: false,
    weight: '1 piece',
    tags: ['KC Das', 'Chhena', 'Traditional'],
  },
  {
    id: 'ko-sweet-15',
    name: 'KC Das Kheer Kadam',
    description: 'A tender syrupy baby rasgulla encased in a soft khoya shell dusted with dry coconut. Signature two-in-one sweet from KC Das.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/kheer-kadam-min.jpg',
    price: 70,
    discountPrice: 52,
    rating: 4.9,
    ratingCount: 450,
    stock: 28,
    featured: false,
    weight: '1 piece',
    tags: ['KC Das', 'Dual Layer', 'Classic'],
  },
  {
    id: 'ko-sweet-16',
    name: 'KC Das Lal Mohan / Gulab Jamun',
    description: 'Deep golden-brown khoya balls soaked in fragrant rose-cardamom sugar syrup. Soft, melt-in-mouth, and irresistibly aromatic.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/gulab-jamun-min.jpg',
    price: 70,
    discountPrice: 52,
    rating: 4.8,
    ratingCount: 610,
    stock: 40,
    featured: false,
    weight: '1 piece',
    tags: ['KC Das', 'Gulab Jamun', 'Popular'],
  },
  {
    id: 'ko-sweet-17',
    name: 'KC Das Rossomalancha',
    description: 'A unique KC Das creation — spongy chhena balls served in rich, thickened rabri rather than plain syrup. The best of Rasgulla and Rasmalai combined.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/rassomalancha-min.jpg',
    price: 88,
    discountPrice: 65,
    rating: 4.9,
    ratingCount: 280,
    stock: 20,
    featured: true,
    weight: '1 piece',
    tags: ['KC Das', 'Signature', 'Rabri'],
  },
  {
    id: 'ko-sweet-18',
    name: 'KC Das Gur Rasogolla',
    description: 'Traditional Rasogulla made with date palm jaggery (nolen gur) instead of white sugar syrup, giving it a distinctive caramel flavour.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/gur-rasgulla-min.jpg',
    price: 31,
    discountPrice: 23,
    rating: 4.9,
    ratingCount: 370,
    stock: 35,
    featured: true,
    weight: '1 piece',
    tags: ['KC Das', 'Nolen Gur', 'Winter Special'],
  },
  {
    id: 'ko-sweet-19',
    name: 'KC Das Canned Rossogolla',
    description: 'The iconic KC Das Rossogolla preserved in food-grade cans for long shelf life. Perfect gifting option with authentic taste guaranteed.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/canned-rasgulla-min.jpg',
    price: 358,
    discountPrice: 265,
    rating: 4.8,
    ratingCount: 490,
    stock: 60,
    featured: false,
    weight: '1 can',
    tags: ['KC Das', 'Canned', 'Gift'],
  },
  {
    id: 'ko-sweet-20',
    name: 'KC Das Canned Kala Jamun',
    description: 'Deep dark khoya balls with a crisp exterior and soft interior, canned for freshness. A darker, richer cousin of Gulab Jamun by KC Das.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/kala-jamun-min.jpg',
    price: 350,
    discountPrice: 259,
    rating: 4.7,
    ratingCount: 220,
    stock: 50,
    featured: false,
    weight: '1 can',
    tags: ['KC Das', 'Canned', 'Kala Jamun'],
  },
  {
    id: 'ko-sweet-21',
    name: 'KC Das Gaja',
    description: 'Crispy, flaky deep-fried wheat strips coated in sugar syrup. A festive Bengali sweet popular during Durga Puja and special occasions.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/gaja-min.jpg',
    price: 30,
    discountPrice: 22,
    rating: 4.6,
    ratingCount: 185,
    stock: 45,
    featured: false,
    weight: '1 piece',
    tags: ['KC Das', 'Festive', 'Crispy'],
  },
  {
    id: 'ko-sweet-22',
    name: 'KC Das Kaju Roll (100g)',
    description: 'Smooth, melt-in-mouth cashew fudge rolls made from premium whole cashews and sugar. A luxurious dry sweet perfect for gifting.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/kaju-roll-min.jpg',
    price: 358,
    discountPrice: 265,
    rating: 4.9,
    ratingCount: 340,
    stock: 30,
    featured: true,
    weight: '100g',
    tags: ['KC Das', 'Cashew', 'Premium Gift'],
  },
  {
    id: 'ko-sweet-23',
    name: 'KC Das Soan Papdi (100g)',
    description: 'Light, flaky cardamom-and-pistachio flavoured threads of gram flour and sugar. The beloved Bengali version of this airy confection by KC Das.',
    image: 'https://www.kcdas.in/wp-content/uploads/2021/03/soan-papdi-min.jpg',
    price: 211,
    discountPrice: 156,
    rating: 4.7,
    ratingCount: 260,
    stock: 40,
    featured: false,
    weight: '100g',
    tags: ['KC Das', 'Flaky', 'Cardamom'],
  },
];

const run = async () => {
  try {
    await connectDB();

    const kolkata = await Region.findOne({ slug: 'kolkata' });
    if (!kolkata) throw new Error('Kolkata region not found. Run the main seed first.');

    const sweetsCat = await Category.findOneAndUpdate(
      { slug: 'kc-das', region: kolkata._id },
      {
        $setOnInsert: {
          slug: 'kc-das',
          region: kolkata._id,
          displayName: 'KC Das Sweets',
          kolkataTitle: 'KC Das Signature Sweets',
          kolkataSubtitle: 'LEGENDARY KOLKATA MISHTI',
          sortOrder: 8,
        },
      },
      { upsert: true, new: true }
    );

    // Remove any existing KC Das products to avoid duplicates on re-run
    const kcDasIds = kcDasSweets.map(p => p.id);
    const removed = await Product.deleteMany({ name: { $in: kcDasSweets.map(p => p.name) }, region: kolkata._id });
    if (removed.deletedCount > 0) console.log(`Removed ${removed.deletedCount} existing KC Das products before re-inserting.`);

    const docs = kcDasSweets.map(p => ({
      name: p.name,
      description: p.description,
      region: kolkata._id,
      category: sweetsCat._id,
      image: p.image,
      price: p.price,
      discountPrice: p.discountPrice,
      rating: p.rating,
      ratingCount: p.ratingCount,
      stock: p.stock,
      featured: p.featured,
      weight: p.weight,
      tags: p.tags,
      active: true,
      sortOrder: 0,
    }));

    await Product.insertMany(docs);
    console.log(`✅ Inserted ${docs.length} KC Das Kolkata sweets successfully.`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
