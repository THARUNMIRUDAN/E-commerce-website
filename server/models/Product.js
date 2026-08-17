import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be positive'],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one product image'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock count'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search optimization
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
