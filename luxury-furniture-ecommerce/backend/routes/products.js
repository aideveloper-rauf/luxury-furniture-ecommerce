const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = TRUE
    `;
    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    if (featured === 'true') {
      query += ' AND p.is_featured = TRUE';
    }

    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY p.price DESC';
        break;
      case 'newest':
        query += ' ORDER BY p.created_at DESC';
        break;
      default:
        query += ' ORDER BY p.is_featured DESC, p.created_at DESC';
    }

    // Pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await db.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE is_active = TRUE';
    const countParams = [];
    if (category) {
      countQuery += ' AND category_id = ?';
      countParams.push(category);
    }
    if (featured === 'true') {
      countQuery += ' AND is_featured = TRUE';
    }
    const [{ total }] = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ? AND p.is_active = TRUE
    `, [req.params.id]);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get product images
    const [images] = await db.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order, is_primary DESC',
      [req.params.id]
    );

    // Get related products
    const [relatedProducts] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.category_id = ? AND p.id != ? AND p.is_active = TRUE 
      ORDER BY RAND() 
      LIMIT 4
    `, [products[0].category_id, req.params.id]);

    res.json({
      success: true,
      data: {
        ...products[0],
        images,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, categoryId, price, salePrice, sku, stockQuantity, dimensions, material, color, weight, isFeatured } = req.body;

    const [result] = await db.query(
      `INSERT INTO products (name, description, category_id, price, sale_price, sku, stock_quantity, dimensions, material, color, weight, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, categoryId, price, salePrice, sku, stockQuantity, dimensions, material, color, weight, isFeatured || false]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      productId: result.insertId
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, categoryId, price, salePrice, sku, stockQuantity, dimensions, material, color, weight, isFeatured, isActive } = req.body;

    await db.query(
      `UPDATE products SET 
        name = ?, description = ?, category_id = ?, price = ?, sale_price = ?, 
        sku = ?, stock_quantity = ?, dimensions = ?, material = ?, color = ?, 
        weight = ?, is_featured = ?, is_active = ? 
       WHERE id = ?`,
      [name, description, categoryId, price, salePrice, sku, stockQuantity, dimensions, material, color, weight, isFeatured, isActive, req.params.id]
    );

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.query('UPDATE products SET is_active = FALSE WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
