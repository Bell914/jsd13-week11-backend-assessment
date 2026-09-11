// In-memory data store for products
let products = [
  { id: '1', name: 'Mechanical Keyboard', price: 89.99, quantity: 1 },
  { id: '2', name: 'Wireless Gaming Mouse', price: 49.99, quantity: 2 },
  { id: '3', name: '27-inch 4K Monitor', price: 299.99, quantity: 1 },
  { id: '4', name: 'Braided USB-C Cable', price: 12.50, quantity: 3 }
];

const Product = {
  // get all products
  getAll({ search, sort } = {}) {
    let result = [...products];

    // Filter by name if search query is provided
    if (search && typeof search === 'string' && search.trim() !== '') {
      const keyword = search.trim().toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(keyword));
    }

    // Sort products if sort query is provided
    if (sort) {
      switch (sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }
    }

    return result;
  },

  // get product by id
  getById(id) {
    return products.find(p => String(p.id) === String(id)) || null;
  },

  // create new product
  create({ name, price, quantity }) {
    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Product name is required.');
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new Error('Product price must be a valid non-negative number.');
    }

    let parsedQuantity = quantity !== undefined ? Number(quantity) : 1;
    if (isNaN(parsedQuantity) || parsedQuantity < 1 || !Number.isInteger(parsedQuantity)) {
      throw new Error('Product quantity must be an integer of at least 1.');
    }

    const newProduct = {
      id: String(Date.now()),
      name: name.trim(),
      price: parsedPrice,
      quantity: parsedQuantity
    };

    products.push(newProduct);
    return newProduct;
  },

  // update product
  update(id, updates) {
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      return null;
    }

    const current = products[index];

    // Validate if provided
    let updatedName = current.name;
    if (updates.name !== undefined) {
      if (typeof updates.name !== 'string' || updates.name.trim() === '') {
        throw new Error('Product name cannot be empty.');
      }
      updatedName = updates.name.trim();
    }

    let updatedPrice = current.price;
    if (updates.price !== undefined) {
      const parsedPrice = Number(updates.price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        throw new Error('Product price must be a valid non-negative number.');
      }
      updatedPrice = parsedPrice;
    }

    let updatedQuantity = current.quantity;
    if (updates.quantity !== undefined) {
      const parsedQuantity = Number(updates.quantity);
      if (isNaN(parsedQuantity) || parsedQuantity < 1 || !Number.isInteger(parsedQuantity)) {
        throw new Error('Product quantity must be an integer of at least 1.');
      }
      updatedQuantity = parsedQuantity;
    }

    products[index] = {
      ...current,
      name: updatedName,
      price: updatedPrice,
      quantity: updatedQuantity
    };

    return products[index];
  },

  // delete product
  delete(id) {
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      return null;
    }

    const [deleted] = products.splice(index, 1);
    return deleted;
  }
};

module.exports = Product;
