const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Create new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { shippingAddressId, billingAddressId, paymentMethod, notes, couponCode } = req.body;

    // Get cart
    const [carts] = await db.query('SELECT * FROM cart WHERE user_id = ?', [req.userId]);
    if (carts.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const cartId = carts[0].id;

    // Get cart items
    const [cartItems] = await db.query(`
      SELECT ci.*, p.price, p.stock_quantity 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cartId]);

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * parseFloat(item.price)), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 500 ? 0 : 99.99;
    
    // Apply coupon if provided
    let discountAmount = 0;
    if (couponCode) {
      const [coupons] = await db.query(
        'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE AND valid_from <= CURDATE() AND valid_until >= CURDATE()',
        [couponCode]
      );
      
      if (coupons.length > 0 && subtotal >= coupons[0].min_order_amount) {
        const coupon = coupons[0];
        if (coupon.discount_type === 'percentage') {
          discountAmount = (subtotal * coupon.discount_value) / 100;
          if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
            discountAmount = coupon.max_discount_amount;
          }
        } else {
          discountAmount = coupon.discount_value;
        }
      }
    }

    const total = subtotal + tax + shipping - discountAmount;

    // Generate order number
    const orderNumber = 'LF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Start transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Create order
      const [orderResult] = await connection.query(
        `INSERT INTO orders (order_number, user_id, status, subtotal, tax_amount, shipping_cost, discount_amount, total_amount, payment_method, shipping_address_id, billing_address_id, notes)
         VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderNumber, req.userId, subtotal, tax, shipping, discountAmount, total, paymentMethod || 'credit_card', shippingAddressId, billingAddressId, notes]
      );

      const orderId = orderResult.insertId;

      // Create order items and update stock
      for (const item of cartItems) {
        if (item.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ID: ${item.product_id}`);
        }

        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price, item.quantity * parseFloat(item.price)]
        );

        // Update stock
        await connection.query(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Clear cart
      await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

      // Record order status history
      await connection.query(
        'INSERT INTO order_status_history (order_id, new_status, changed_by) VALUES (?, ?, ?)',
        [orderId, 'pending', req.userId]
      );

      await connection.commit();

      // Get complete order details
      const [orders] = await connection.query(`
        SELECT o.*, u.first_name, u.last_name, u.email, a.address_line1, a.city, a.state, a.postal_code
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN addresses a ON o.shipping_address_id = a.id
        WHERE o.id = ?
      `, [orderId]);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: orders[0]
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// Get user orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, 
             GROUP_CONCAT(p.name SEPARATOR ', ') as items_summary
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.userId]);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.first_name, u.last_name, u.email,
             sa.address_line1 as shipping_address, sa.city as shipping_city, sa.state as shipping_state, sa.postal_code as shipping_postal,
             ba.address_line1 as billing_address, ba.city as billing_city, ba.state as billing_state, ba.postal_code as billing_postal
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN addresses sa ON o.shipping_address_id = sa.id
      LEFT JOIN addresses ba ON o.billing_address_id = ba.id
      WHERE o.id = ? AND o.user_id = ?
    `, [req.params.id, req.userId]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Get order items
    const [items] = await db.query(`
      SELECT oi.*, p.name, p.sku, pi.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE oi.order_id = ?
    `, [req.params.id]);

    // Get status history
    const [history] = await db.query(
      'SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...orders[0],
        items,
        statusHistory: history
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
