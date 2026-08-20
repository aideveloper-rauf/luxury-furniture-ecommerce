const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get cart for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get or create cart
    let [carts] = await db.query('SELECT * FROM cart WHERE user_id = ?', [req.userId]);
    
    if (carts.length === 0) {
      const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [req.userId]);
      carts = [{ id: result.insertId, user_id: req.userId }];
    }

    const cart = carts[0];

    // Get cart items with product details
    const [items] = await db.query(`
      SELECT ci.*, p.name, p.price, p.sale_price, p.sku, pi.image_url 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_images pi ON ci.product_id = pi.product_id AND pi.is_primary = TRUE
      WHERE ci.cart_id = ?
    `, [cart.id]);

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.price)), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 500 ? 0 : 99.99; // Free shipping over $500
    const total = subtotal + tax + shipping;

    res.json({
      success: true,
      data: {
        id: cart.id,
        items,
        totals: {
          subtotal,
          tax,
          shipping,
          total
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add item to cart
router.post('/items', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Get or create cart
    let [carts] = await db.query('SELECT * FROM cart WHERE user_id = ?', [req.userId]);
    
    if (carts.length === 0) {
      const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [req.userId]);
      carts = [{ id: result.insertId }];
    }

    const cartId = carts[0].id;

    // Check if item already exists in cart
    const [existingItems] = await db.query(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (existingItems.length > 0) {
      // Update quantity
      await db.query(
        'UPDATE cart_items SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE cart_id = ? AND product_id = ?',
        [quantity, cartId, productId]
      );
    } else {
      // Add new item
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, quantity]
      );
    }

    // Return updated cart
    const [items] = await db.query(`
      SELECT ci.*, p.name, p.price, p.sale_price, p.sku 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cartId]);

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.price)), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 500 ? 0 : 99.99;
    const total = subtotal + tax + shipping;

    res.json({
      success: true,
      message: 'Item added to cart',
      data: {
        items,
        totals: { subtotal, tax, shipping, total }
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/items/:itemId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity <= 0) {
      // Remove item
      await db.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
    } else {
      await db.query('UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [quantity, itemId]);
    }

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/items/:itemId', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM cart_items WHERE id = ?', [req.params.itemId]);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Clear cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const [carts] = await db.query('SELECT * FROM cart WHERE user_id = ?', [req.userId]);
    if (carts.length > 0) {
      await db.query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
