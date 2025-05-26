const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ ADD to existing product quantity
router.post('/add-quantity/:id', (req, res) => {
  const productId = req.params.id;
  const { quantity } = req.body;

  const sql = `
    UPDATE products 
    SET quantity = quantity + ? 
    WHERE product_id = ?
  `;

  db.query(sql, [quantity, productId], (err, result) => {
    if (err) {
      console.error("Error adding quantity:", err);
      return res.status(500).json({ message: "Failed to add quantity" });
    }
    res.json({ message: "Quantity updated successfully!" });
  });
});

// GET all products
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ADD new product
router.post('/', (req, res) => {
  const { name, category_id, price, description, image_url, quantity } = req.body;
  const sql = `INSERT INTO products (name, category_id, price, description, image_url, quantity)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [name, category_id, price, description, image_url, quantity], (err, result) => {
    if (err) {
      console.error("Error inserting product:", err);
      res.status(500).json({ message: "Failed to add product" });
    } else {
      res.status(201).json({ message: "Product added" });
    }
  });
});

// UPDATE product
router.put('/:id', (req, res) => {
  const { category_id, price, description, quantity, name, image_url } = req.body;
  const sql = 'UPDATE products SET category_id = ?, price = ?, description = ?, quantity = ?, name = ?, image_url = ? WHERE product_id = ?';
  db.query(sql, [category_id, price, description, quantity, name, image_url, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Product updated!' });
  });
});

// DELETE product
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM products WHERE product_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Product deleted!' });
  });
});

// BUY product (Reduce quantity by 1)
router.post('/buy/:id', (req, res) => {
  const productId = req.params.id;

  // Check if product exists and quantity > 0
  const checkQuery = `SELECT quantity FROM products WHERE product_id = ?`;

  db.query(checkQuery, [productId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const availableQty = results[0].quantity;

    if (availableQty <= 0) {
      return res.status(400).json({ error: 'Out of stock' });
    }

    // Reduce quantity and insert into orders
    const updateQty = `UPDATE products SET quantity = quantity - 1 WHERE product_id = ?`;
    const insertOrder = `INSERT INTO orders (product_id, quantity) VALUES (?, 1)`;

    db.query(updateQty, [productId], (err1) => {
      if (err1) return res.status(500).json({ error: 'Error updating quantity' });

      db.query(insertOrder, [productId], (err2) => {
        if (err2) return res.status(500).json({ error: 'Error recording order' });

        res.json({ message: 'Product purchased and order recorded successfully' });
      });
    });
  });
});                  

module.exports = router;
                            
                           