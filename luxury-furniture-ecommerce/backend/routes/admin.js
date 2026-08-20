const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminMiddleware, deliveryMiddleware } = require('../middleware/auth');

// Get all orders (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = `
      SELECT o.*, u.first_name, u.last_name, u.email,
             GROUP_CONCAT(p.name SEPARATOR ', ') as items_summary
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const [orders] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(DISTINCT o.id) as total FROM orders o';
    if (status) {
      countQuery += ' WHERE o.status = ?';
      const [{ total }] = await db.query(countQuery, [status]);
      var totalCount = total;
    } else {
      const [{ total }] = await db.query(countQuery);
      var totalCount = total;
    }

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update order status (admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { id } = req.params;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Get current status
    const [orders] = await db.query('SELECT status FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const oldStatus = orders[0].status;

    // Update order status
    await db.query('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);

    // Record status history
    await db.query(
      'INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, notes) VALUES (?, ?, ?, ?, ?)',
      [id, oldStatus, status, req.userId, notes]
    );

    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Assign delivery person (admin only)
router.post('/:id/delivery-assign', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;
    const { id } = req.params;

    // Verify delivery person exists and has delivery role
    const [users] = await db.query('SELECT id, role FROM users WHERE id = ? AND role = "delivery"', [deliveryPersonId]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid delivery person' });
    }

    // Create or update delivery assignment
    await db.query(
      `INSERT INTO delivery_assignments (order_id, delivery_person_id, status) 
       VALUES (?, ?, 'assigned')
       ON DUPLICATE KEY UPDATE delivery_person_id = ?, status = 'assigned', assigned_at = CURRENT_TIMESTAMP`,
      [id, deliveryPersonId, deliveryPersonId]
    );

    // Update order status to out_for_delivery
    await db.query('UPDATE orders SET status = "out_for_delivery" WHERE id = ?', [id]);

    res.json({ success: true, message: 'Delivery person assigned successfully' });
  } catch (error) {
    console.error('Assign delivery error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get deliveries for delivery person
router.get('/deliveries/my', authMiddleware, deliveryMiddleware, async (req, res) => {
  try {
    const [deliveries] = await db.query(`
      SELECT da.*, o.order_number, o.status as order_status,
             u.first_name, u.last_name, u.phone,
             a.address_line1, a.city, a.state, a.postal_code
      FROM delivery_assignments da
      JOIN orders o ON da.order_id = o.id
      JOIN users u ON o.user_id = u.id
      JOIN addresses a ON o.shipping_address_id = a.id
      WHERE da.delivery_person_id = ?
      ORDER BY da.created_at DESC
    `, [req.userId]);

    res.json({
      success: true,
      data: deliveries
    });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update delivery status (delivery person)
router.put('/deliveries/:id/status', authMiddleware, deliveryMiddleware, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { id } = req.params;

    const validStatuses = ['assigned', 'picked_up', 'in_transit', 'delivered', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid delivery status' });
    }

    // Update delivery assignment
    await db.query(
      'UPDATE delivery_assignments SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND delivery_person_id = ?',
      [status, notes, id, req.userId]
    );

    // If delivered, update order status
    if (status === 'delivered') {
      await db.query('UPDATE orders SET status = "delivered", actual_delivery_date = CURDATE() WHERE id IN (SELECT order_id FROM delivery_assignments WHERE id = ?)', [id]);
    }

    res.json({ success: true, message: 'Delivery status updated' });
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get dashboard statistics (admin only)
router.get('/stats/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Total orders
    const [{ totalOrders }] = await db.query('SELECT COUNT(*) as totalOrders FROM orders');
    
    // Pending orders
    const [{ pendingOrders }] = await db.query('SELECT COUNT(*) as pendingOrders FROM orders WHERE status = "pending"');
    
    // Revenue this month
    const [{ monthlyRevenue }] = await db.query(
      'SELECT SUM(total_amount) as monthlyRevenue FROM orders WHERE payment_status = "paid" AND MONTH(created_at) = MONTH(CURDATE())'
    );
    
    // Orders by status
    const [ordersByStatus] = await db.query(
      'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
    );

    res.json({
      success: true,
      data: {
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        monthlyRevenue: monthlyRevenue || 0,
        ordersByStatus
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
