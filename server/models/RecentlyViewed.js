import mongoose from 'mongoose';

const recentlyViewedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find & update user's viewed products
recentlyViewedSchema.index({ user: 1, product: 1 }, { unique: true });

const RecentlyViewed = mongoose.model('RecentlyViewed', recentlyViewedSchema);

export default RecentlyViewed;
