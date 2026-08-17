import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import RecentlyViewed from '../models/RecentlyViewed.js';
import { users, categories, getSeedProducts } from './seedData.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    if (Cart) await Cart.deleteMany();
    if (Wishlist) await Wishlist.deleteMany();
    if (Order) await Order.deleteMany();
    if (Review) await Review.deleteMany();
    if (RecentlyViewed) await RecentlyViewed.deleteMany();

    console.log('Inserting users...');
    // Create users individually to trigger bcrypt pre-save hash
    const createdUsers = [];
    for (const u of users) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    console.log('Inserting categories...');
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log('Inserting products...');
    const seedProducts = getSeedProducts(categoryMap);
    await Product.insertMany(seedProducts);

    console.log(`Seeding complete: ${createdUsers.length} users, ${createdCategories.length} categories, ${seedProducts.length} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    if (Cart) await Cart.deleteMany();
    if (Wishlist) await Wishlist.deleteMany();
    if (Order) await Order.deleteMany();
    if (Review) await Review.deleteMany();
    if (RecentlyViewed) await RecentlyViewed.deleteMany();

    console.log('[Seeder] All Data Destroyed!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
