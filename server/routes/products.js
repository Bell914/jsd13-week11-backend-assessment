const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /products - Return all products (supports ?search= and ?sort= query strings)
router.get('/', (req, res, next) => {
  try {
    const { search, sort } = req.query;
    const products = Product.getAll({ search, sort });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// GET /products/:id - Return a single product by ID
router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const product = Product.getById(id);

    if (!product) {
      return res.status(404).json({ error: `Product with ID '${id}' not found.` });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// POST /products - Add a new product
router.post('/', (req, res, next) => {
  try {
    const { name, price, quantity } = req.body;

    // Validate required fields
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name and price are required.' });
    }

    try {
      const newProduct = Product.create({ name, price, quantity });
      res.status(201).json(newProduct);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }
  } catch (error) {
    next(error);
  }
});

// PUT /products/:id - Update an existing product
router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    // Check if body is empty
    if (name === undefined && price === undefined && quantity === undefined) {
      return res.status(400).json({ error: 'At least one field (name, price, or quantity) must be provided to update.' });
    }

    try {
      const updatedProduct = Product.update(id, { name, price, quantity });

      if (!updatedProduct) {
        return res.status(404).json({ error: `Product with ID '${id}' not found.` });
      }

      res.status(200).json(updatedProduct);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /products/:id - Remove a product
router.delete('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = Product.delete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: `Product with ID '${id}' not found.` });
    }

    res.status(200).json({
      message: `Product '${deletedProduct.name}' deleted successfully.`,
      product: deletedProduct
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
