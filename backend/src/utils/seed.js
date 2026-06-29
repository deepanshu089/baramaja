require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');

// Models
const Admin = require('../models/Admin');
const Region = require('../models/Region');
const Category = require('../models/Category');
const Product = require('../models/Product');
const SiteConfig = require('../models/SiteConfig');

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing database...');
    await Admin.deleteMany();
    await Region.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await SiteConfig.deleteMany();

    console.log('Seeding Admins...');
    const adminPasswordHash = await Admin.hashPassword('Baramaja@2024');
    await Admin.create({
      name: 'Super Admin',
      email: 'admin@baramaja.com',
      passwordHash: adminPasswordHash,
      role: 'superadmin',
    });

    console.log('Seeding Regions...');
    const odisha = await Region.create({
      slug: 'odisha',
      displayName: 'Odisha',
      heroHeading: 'Authentic Odisha Sourced Direct To India',
      heroSubtitle: 'Savor the divine Pahala Rasagolas, crispy Ghasipura Nimkis, and organic Kandhamal Haldi sourced directly from local cooperatives and master cooks.',
      heroBadgeLabel: 'THE LAND OF JAGANNATH',
      ctaPrimaryText: 'Shop Odisha',
      ctaSecondaryText: 'Browse Sweets & Snacks',
      ctaSecondaryHref: '#snacks',
      bgImageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1600&auto=format&fit=crop',
      themeColor: 'crimson',
      sortOrder: 1,
    });

    const kolkata = await Region.create({
      slug: 'kolkata',
      displayName: 'Kolkata / Bengal',
      heroHeading: 'Taste The Soul Of Authentic Kolkata',
      heroSubtitle: 'Experience decadent winter Nolen Gur Sandesh, velvety Bhapa Doi, robust Jhalmuri mixtures, and authentic stone-ground Kalna Panch Phoron.',
      heroBadgeLabel: 'THE SOUL OF BENGAL',
      ctaPrimaryText: 'Shop Kolkata',
      ctaSecondaryText: 'Browse Signature Sweets',
      ctaSecondaryHref: '#sweets',
      bgImageUrl: 'https://baramaja.com/cdn/shop/files/JyotiMixturesSoecialChuda.webp?v=1768371102&width=1600',
      themeColor: 'amber',
      sortOrder: 2,
    });

    const regionsMap = { odisha: odisha._id, kolkata: kolkata._id };

    try {
      await Category.collection.dropIndex('slug_1');
      console.log('Successfully dropped unique slug index from Categories collection');
    } catch (e) {
      console.log('Slug unique index not found or already dropped');
    }

    const categoriesData = [
      // --- Odisha Categories ---
      { 
        slug: 'sweets', 
        displayName: 'Sweets', 
        odishaTitle: 'Traditional Odia Sweets',
        odishaSubtitle: 'SWEET TREASURES',
        region: odisha._id,
        sortOrder: 1 
      },
      { 
        slug: 'snacks', 
        displayName: 'Snacks', 
        odishaTitle: 'Odia Crisps & Mixtures',
        odishaSubtitle: 'CRUNCHY BITES',
        region: odisha._id,
        sortOrder: 2 
      },
      { 
        slug: 'masala', 
        displayName: 'Masalas', 
        odishaTitle: 'Ganjam & Kandhamal Stone-Ground Spices',
        odishaSubtitle: 'AROMATIC MASALAS',
        region: odisha._id,
        sortOrder: 3 
      },
      { 
        slug: 'healthy', 
        displayName: 'Healthy Foods', 
        odishaTitle: 'Millet Flour (Mandia) & Scented Rice',
        odishaSubtitle: 'DAILY WELLNESS & GRAINS',
        region: odisha._id,
        sortOrder: 4 
      },
      { 
        slug: 'pickles', 
        displayName: 'Pickles', 
        odishaTitle: "Grandma's Sun-Cured Elephant Apple Ambula",
        odishaSubtitle: 'AGED TANGY PICKLES',
        region: odisha._id,
        sortOrder: 5 
      },
      { 
        slug: 'mixtures', 
        displayName: 'Mixtures', 
        odishaTitle: 'Heritage Odia Mixtures',
        odishaSubtitle: 'EVENING SNACKS',
        region: odisha._id,
        sortOrder: 6 
      },

      // --- Kolkata Categories ---
      {
        slug: 'sweets',
        displayName: 'Sweets',
        kolkataTitle: 'Kolkata Signature Mishti',
        kolkataSubtitle: 'SWEET TREASURES',
        region: kolkata._id,
        sortOrder: 1
      },
      {
        slug: 'mithai',
        displayName: 'Mithai',
        kolkataTitle: 'Aflatun Mithai Collection',
        kolkataSubtitle: 'RICH MAWA DELIGHTS',
        region: kolkata._id,
        sortOrder: 7
      },
      { 
        slug: 'snacks', 
        displayName: 'Snacks', 
        kolkataTitle: 'Bengali High-Spice Chanachurs',
        kolkataSubtitle: 'CRUNCHY BITES',
        region: kolkata._id,
        sortOrder: 2 
      },
      { 
        slug: 'masala', 
        displayName: 'Masalas', 
        kolkataTitle: 'Kalna & Royal Bengal Mustard Blends',
        kolkataSubtitle: 'AROMATIC MASALAS',
        region: kolkata._id,
        sortOrder: 3 
      },
      { 
        slug: 'healthy', 
        displayName: 'Healthy Foods', 
        kolkataTitle: 'Heritage Govindobhog & Pure Nolen Gur',
        kolkataSubtitle: 'DAILY WELLNESS & GRAINS',
        region: kolkata._id,
        sortOrder: 4 
      },
      { 
        slug: 'pickles', 
        displayName: 'Pickles', 
        kolkataTitle: 'Traditional Jujube Kuler & Aam Tel',
        kolkataSubtitle: 'AGED TANGY PICKLES',
        region: kolkata._id,
        sortOrder: 5 
      },
      { 
        slug: 'mixtures', 
        displayName: 'Mixtures', 
        kolkataTitle: 'Authentic Bengali Bhujia & Mixtures',
        kolkataSubtitle: 'EVENING SNACKS',
        region: kolkata._id,
        sortOrder: 6 
      },
    ];
    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach(c => {
      const regSlug = c.region.toString() === odisha._id.toString() ? 'odisha' : 'kolkata';
      catMap[`${regSlug}_${c.slug}`] = c._id;
    });

    console.log('Seeding Site Config...');
    await SiteConfig.create([
      { key: 'siteName', value: 'Baramaja India' },
      { key: 'tagline', value: 'Authentic Regional Foods' },
      { key: 'defaultRegion', value: 'odisha' },
    ]);

    console.log('Reading products from frontend TS file...');
    const tsFilePath = path.join(__dirname, '../../../frontend/src/data/products.ts');
    let tsContent = fs.readFileSync(tsFilePath, 'utf-8');
    
    // Extract the array content
    const arrayStart = tsContent.indexOf('[');
    const arrayEnd = tsContent.lastIndexOf(']');
    const arrayString = tsContent.substring(arrayStart, arrayEnd + 1);
    
    // Safely evaluate the array string
    const productsArray = eval(`(${arrayString})`);

    console.log(`Found ${productsArray.length} products. Seeding...`);
    
    const productsToInsert = productsArray.map(p => {
      const regionSlug = p.state || 'odisha';
      const key = `${regionSlug}_${p.category || 'sweets'}`;
      const defaultKey = `${regionSlug}_sweets`;
      return {
        name: p.name,
        description: p.description,
        region: regionsMap[regionSlug],
        category: catMap[key] || catMap[defaultKey],
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
      };
    });

    await Product.insertMany(productsToInsert);

    console.log('✅ Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
