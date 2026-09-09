import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  idMeal: {
    type: String,
    required: [true, 'Meal ID is required'],
  },
  strMeal: {
    type: String,
    required: [true, 'Meal title is required'],
  },
  strMealThumb: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    default: 0,
    min: [0, 'Price cannot be negative'],
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: [1, 'Quantity must be at least 1'],
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

// Virtual property to calculate total items in cart
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

// Virtual property to calculate total amount
cartSchema.virtual('totalPrice').get(function () {
  return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
});

cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
