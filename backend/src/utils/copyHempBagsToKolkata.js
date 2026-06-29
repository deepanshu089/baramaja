require('dotenv').config();
const connectDB = require('../config/db');
const Region = require('../models/Region');
const Category = require('../models/Category');
const Product = require('../models/Product');

const run = async () => {
  try {
    await connectDB();

    const odisha = await Region.findOne({ slug: 'odisha' });
    const kolkata = await Region.findOne({ slug: 'kolkata' });
    if (!odisha || !kolkata) throw new Error('Odisha or Kolkata region not found. Run the main seed first.');

    const hempProducts = await Product.find({
      region: odisha._id,
      name: { $regex: /hemp/i },
    }).populate('category');

    if (hempProducts.length === 0) {
      console.log('No "hemp" products found under Odisha. Check the product name spelling in the admin panel.');
      process.exit();
    }

    console.log(`Found ${hempProducts.length} hemp product(s) under Odisha:`);
    hempProducts.forEach(p => console.log(` - ${p.name} (category: ${p.category?.slug})`));

    const docs = [];
    for (const p of hempProducts) {
      const categorySlug = p.category?.slug || 'healthy';

      let kolkataCat = await Category.findOne({ slug: categorySlug, region: kolkata._id });
      if (!kolkataCat) {
        kolkataCat = await Category.create({
          slug: categorySlug,
          region: kolkata._id,
          displayName: p.category?.displayName || categorySlug,
          kolkataTitle: p.category?.odishaTitle || p.category?.displayName || categorySlug,
          kolkataSubtitle: p.category?.odishaSubtitle || '',
          sortOrder: p.category?.sortOrder || 0,
        });
      }

      // Remove existing copy in Kolkata to avoid duplicates on re-run
      await Product.deleteOne({ name: p.name, region: kolkata._id });

      docs.push({
        name: p.name,
        description: p.description,
        region: kolkata._id,
        category: kolkataCat._id,
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
        sortOrder: p.sortOrder || 0,
      });
    }

    await Product.insertMany(docs);
    console.log(`✅ Copied ${docs.length} hemp product(s) into Kolkata (kept the originals in Odisha).`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
