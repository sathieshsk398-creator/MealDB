import Cart from '../models/Cart.js';

/**
 * @desc    Get current user's cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message,
    });
  }
};

/**
 * @desc    Add item to cart or update quantity
 * @route   POST /api/cart
 * @access  Private
 */
export const addToCart = async (req, res) => {
  try {
    const { idMeal, strMeal, strMealThumb, price, quantity = 1 } = req.body;

    if (!idMeal || !strMeal) {
      return res.status(400).json({
        success: false,
        message: 'Please provide meal id and meal title',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => String(item.idMeal) === String(idMeal)
    );

    const numericPrice = Number(price) || 0;
    const numericQty = Math.max(1, Number(quantity) || 1);

    if (itemIndex > -1) {
      // Item already in cart, increment quantity
      cart.items[itemIndex].quantity += numericQty;
      if (price !== undefined) {
        cart.items[itemIndex].price = numericPrice;
      }
    } else {
      // New item, add to array
      cart.items.push({
        idMeal: String(idMeal),
        strMeal,
        strMealThumb: strMealThumb || '',
        price: numericPrice,
        quantity: numericQty,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message,
    });
  }
};

/**
 * @desc    Remove an item from cart
 * @route   DELETE /api/cart/:idMeal
 * @access  Private
 */
export const removeFromCart = async (req, res) => {
  try {
    const idMeal = req.params.idMeal || req.body?.idMeal || req.body?.mealId || req.query?.idMeal;

    if (!idMeal) {
      return res.status(400).json({
        success: false,
        message: 'Please provide idMeal of the item to remove.',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found for this user',
      });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => String(item.idMeal) !== String(idMeal));

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message,
    });
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    } else {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message,
    });
  }
};
