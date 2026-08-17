import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderCode: {
      type: String,
      unique: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Cash on Delivery',
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discountAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    deliveryPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Pending',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate readable order code (e.g., RV-2026-XXXX)
orderSchema.pre('save', function (next) {
  if (!this.orderCode) {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    this.orderCode = `RV${randomSuffix}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
