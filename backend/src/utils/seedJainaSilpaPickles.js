require('dotenv').config();
const connectDB = require('../config/db');
const Region = require('../models/Region');
const Category = require('../models/Category');
const Product = require('../models/Product');

const groups = [
  {
    label: 'Pickles, Achar & Chutneys',
    descTemplate: (name) => `Traditional Bengali ${name} made the Jaina Silpa Mandir way — tangy, spiced, and slow-cured for authentic flavour.`,
    price: 180, discountPrice: 150, weight: '250g', tags: ['Jaina Silpa Mandir', 'Achar', 'Pickle'],
    items: [
      { name: 'Nawabi Achar', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Nawabi-Achar-1.jpg?fit=800%2C800&ssl=1' },
      { name: 'Green Chilli Pickle', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Green-Chilli-2.jpg?fit=800%2C800&ssl=1' },
      { name: 'Borai Pickle', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Borai-Pickle-2.jpg?fit=800%2C800&ssl=1' },
      { name: 'Aamsi Achar', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Aamsi-Chutney-1.jpg?fit=400%2C480&ssl=1' },
      { name: 'Tamarind Pickle', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Tamarind-Chutney_2-1.jpg?fit=400%2C480&ssl=1' },
      { name: 'Mango Kashmiri Chutney', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Mango-Kashmiri.jpg?fit=800%2C800&ssl=1' },
      { name: 'Mango Kasundi', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Mango-Kasundi-3.jpg?fit=800%2C800&ssl=1' },
    ],
  },
  {
    label: 'Hazmi Digestives & Golis (Standard)',
    descTemplate: (name) => `Classic tangy-spicy ${name} digestive — a popular hazmi mouth freshener after meals.`,
    price: 25, discountPrice: 20, weight: '50g', tags: ['Jaina Silpa Mandir', 'Hazmi', 'Goli', 'Standard'],
    items: [
      { name: 'Imli Goli', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Imli-Goli.jpg?fit=800%2C800&ssl=1' },
      { name: 'Jeera Goli XL', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Jeera-Goli-2.jpg?fit=800%2C800&ssl=1' },
      { name: 'Anar Dana', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/Anar-dana-goli.jpg?fit=637%2C697&ssl=1' },
      { name: 'Mangola', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/Mangola-2-scaled.jpg?fit=1777%2C2560&ssl=1' },
      { name: 'Chat Amla', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/DSC_5193-scaled.jpg?fit=1594%2C2560&ssl=1' },
      { name: 'Tapatap Goli', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/Tapatap-Goli-scaled.jpg?fit=1773%2C2560&ssl=1' },
      { name: 'Khatta Aam', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/06/Khatta-Aam-4.jpg?fit=2100%2C1500&ssl=1' },
      { name: 'Dalim Goli', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Dalim-Goli.jpg?fit=800%2C800&ssl=1' },
    ],
  },
  {
    label: 'Hazmi Digestives & Golis (Premium)',
    descTemplate: (name) => `Premium quality ${name} — a richer, finer-grade hazmi digestive goli from Jaina Silpa Mandir.`,
    price: 35, discountPrice: 28, weight: '50g', tags: ['Jaina Silpa Mandir', 'Hazmi', 'Goli', 'Premium'],
    items: [
      { name: 'Jeera Goli Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Jeera-Goli.jpg?fit=800%2C800&ssl=1' },
      { name: 'Dalim Goli Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Dalim-Goli.jpg?fit=800%2C800&ssl=1' },
      { name: 'Anar Dana Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/Anar-dana-goli.jpg?fit=637%2C697&ssl=1' },
      { name: 'Mangola Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/Mangola-2-scaled.jpg?fit=1777%2C2560&ssl=1' },
      { name: 'Tapatap Goli Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/Tapatap-Goli-scaled.jpg?fit=1773%2C2560&ssl=1' },
      { name: 'Khatta Aam Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Khatta-Aam.jpg?fit=800%2C800&ssl=1' },
      { name: 'Amrit Amla Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-26-at-20.37.19.png?fit=607%2C1080&ssl=1' },
      { name: 'Kuberpati Goli Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/Kuberpati-Goli-scaled.jpg?fit=1623%2C2560&ssl=1' },
      { name: 'Khatta Chuhara Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Khatta-Chuhara.jpg?fit=800%2C800&ssl=1' },
      { name: 'Mast Mango Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Mast-Mango.jpg?fit=800%2C800&ssl=1' },
      { name: 'Jet Imli Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Jet-Imli.jpeg?fit=1024%2C1024&ssl=1' },
      { name: 'Kacha Aam Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Kacha-AAm.jpg?fit=800%2C800&ssl=1' },
      { name: 'Chatpat Goli Black Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Chatpat-Goli-Black.jpg?fit=900%2C900&ssl=1' },
      { name: 'Chatpat Goli Red Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Chatpat-Red.jpg?fit=800%2C800&ssl=1' },
      { name: 'Bhaskar Laban Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Vaskar-Laban.jpg?fit=800%2C800&ssl=1' },
      { name: 'Dry Amla Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Dry-Amla.jpg?fit=800%2C800&ssl=1' },
      { name: 'Ginger Pachak Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/Ginger-Pachak-scaled.jpg?fit=1707%2C2560&ssl=1' },
      { name: 'Kimiss Pachak Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Kismiss-Pachak.jpg?fit=800%2C800&ssl=1' },
      { name: 'Munakka Pachak Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Munakka-Pachak.jpg?fit=800%2C800&ssl=1' },
      { name: 'Amla Pachak Premium', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Amla-Pachak.jpg?fit=800%2C800&ssl=1' },
    ],
  },
  {
    label: 'Pachak & Amla (Standard)',
    descTemplate: (name) => `A soothing ${name} digestive — light, tangy, and traditionally enjoyed after meals.`,
    price: 30, discountPrice: 24, weight: '50g', tags: ['Jaina Silpa Mandir', 'Pachak', 'Standard'],
    items: [
      { name: 'Amla Pachak', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/Amla-Pachak-scaled.jpg?fit=1729%2C2560&ssl=1' },
      { name: 'Dilbahar Pachak', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/06/Dilbahar-Pachak-4.jpg?fit=2100%2C1500&ssl=1' },
      { name: 'Kimiss Pachak', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Kismiss-Pachak.jpg?fit=800%2C800&ssl=1' },
      { name: 'Munakka Pachak', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/04/Munakka-Pachak-scaled.jpg?fit=1812%2C2560&ssl=1' },
      { name: 'Dry Amla', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Dry-Amla.jpg?fit=800%2C800&ssl=1' },
    ],
  },
  {
    label: 'Supari & Mouth Fresheners (Mix)',
    descTemplate: (name) => `${name} — a fragrant, flavoured supari mouth-freshener mix to finish off any meal.`,
    price: 40, discountPrice: 32, weight: '100g', tags: ['Jaina Silpa Mandir', 'Supari', 'Mouth Freshener'],
    items: [
      { name: 'Navratan Mix', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Navratan-Mix.jpg?fit=800%2C800&ssl=1' },
      { name: 'Panjabi Mix', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Panjabi-Mix.jpg?fit=800%2C800&ssl=1' },
      { name: 'Party Special', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Party-Special.jpg?fit=800%2C800&ssl=1' },
      { name: 'Sweet Mix', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Sweet-Mix.jpg?fit=800%2C800&ssl=1' },
      { name: 'Kesar Mix', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Kesar-Mix.jpg?fit=800%2C800&ssl=1' },
      { name: 'Rajasthani Mix', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Rajasthani-Mix.jpg?fit=800%2C800&ssl=1' },
      { name: 'Chocolate Mix', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Chocolate-Mix.jpg?fit=800%2C800&ssl=1' },
      { name: 'Jhankar Mix', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Jhankar-Mix.jpg?fit=800%2C800&ssl=1' },
      { name: 'Shimla Mix', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Shimla-Mix.jpg?fit=800%2C800&ssl=1' },
      { name: 'Ice Supari', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Sample-Supari.png?fit=800%2C800&ssl=1' },
      { name: 'Sweet Khejur', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Sample-Supari.png?fit=800%2C800&ssl=1' },
      { name: 'Jet Chuhara', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2024/01/Jet-Chuhara.jpg?fit=800%2C800&ssl=1' },
    ],
  },
  {
    label: 'Bori (Lentil Dumplings)',
    descTemplate: (name) => `Sun-dried ${name} — traditional Bengali lentil dumplings ready to fry and add to curries.`,
    price: 150, discountPrice: 120, weight: 'Pack of 2', tags: ['Jaina Silpa Mandir', 'Bori', 'Lentil Dumplings'],
    items: [
      { name: 'Posto Bori Premium (Pack of 2)', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/08/posto-bori.jpg?fit=1890%2C1417&ssl=1' },
      { name: 'Urad Bori Premium (Pack of 2)', image: 'https://i0.wp.com/jainasilpamandir.com/wp-content/uploads/2025/08/Urad-Bori-Combo-Pack-2.jpg?fit=1890%2C1417&ssl=1' },
    ],
  },
];

const allProducts = groups.flatMap(g =>
  g.items.map(item => ({
    name: item.name,
    description: g.descTemplate(item.name),
    image: item.image,
    price: g.price,
    discountPrice: g.discountPrice,
    rating: 4.5,
    ratingCount: 30,
    stock: 40,
    featured: false,
    weight: g.weight,
    tags: g.tags,
  }))
);

const run = async () => {
  try {
    await connectDB();

    const kolkata = await Region.findOne({ slug: 'kolkata' });
    if (!kolkata) throw new Error('Kolkata region not found. Run the main seed first.');

    const picklesCat = await Category.findOne({ slug: 'pickles', region: kolkata._id });
    if (!picklesCat) throw new Error('Kolkata pickles category not found. Run the main seed first.');

    const names = allProducts.map(p => p.name);
    const removed = await Product.deleteMany({ name: { $in: names }, region: kolkata._id });
    if (removed.deletedCount > 0) console.log(`Removed ${removed.deletedCount} existing Jaina Silpa Mandir products before re-inserting.`);

    const docs = allProducts.map(p => ({
      ...p,
      region: kolkata._id,
      category: picklesCat._id,
      active: true,
      sortOrder: 0,
    }));

    await Product.insertMany(docs);
    console.log(`✅ Inserted ${docs.length} Jaina Silpa Mandir products into Kolkata pickles.`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
