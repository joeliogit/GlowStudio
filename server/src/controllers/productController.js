const { query, withTransaction } = require('../config/db');

// ─── Get All Products ─────────────────────────────────────────────────────────
const getProducts = async (req, res, next) => {
  try {
    const { category, search, active_only = 'true' } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (active_only === 'true') {
      whereClause += ' AND is_active = true';
    }
    if (category) {
      params.push(category);
      whereClause += ` AND category = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      whereClause += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    const { rows } = await query(
      `SELECT * FROM products ${whereClause} ORDER BY name ASC`,
      params
    );

    res.json({ products: rows });
  } catch (err) {
    next(err);
  }
};

// ─── Get Product By ID ────────────────────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query('SELECT * FROM products WHERE id = $1', [id]);

    if (!rows.length) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json({ product: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── Create Product (admin) ───────────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, low_stock_threshold, brand, sku, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos.' });
    }

    const { rows } = await query(
      `INSERT INTO products (name, description, category, price, stock, low_stock_threshold, brand, sku, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [name, description || null, category || null, price, stock || 0,
       low_stock_threshold || 5, brand || null, sku || null, image_url || null]
    );

    res.status(201).json({ product: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── Update Product (admin) ───────────────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, low_stock_threshold, brand, sku, image_url, is_active } = req.body;

    const { rows } = await query(
      `UPDATE products
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           price = COALESCE($4, price),
           low_stock_threshold = COALESCE($5, low_stock_threshold),
           brand = COALESCE($6, brand),
           sku = COALESCE($7, sku),
           image_url = COALESCE($8, image_url),
           is_active = COALESCE($9, is_active),
           updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [name, description, category, price, low_stock_threshold, brand, sku, image_url, is_active, id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json({ product: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── Delete Product (admin) ───────────────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Soft delete
    const { rows } = await query(
      'UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json({ message: 'Producto desactivado correctamente.' });
  } catch (err) {
    next(err);
  }
};

// ─── Update Stock (receptionist/admin) ───────────────────────────────────────
const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { change_amount, reason } = req.body;

    if (change_amount === undefined || change_amount === null) {
      return res.status(400).json({ error: 'change_amount es requerido.' });
    }

    const result = await withTransaction(async (client) => {
      const productResult = await client.query(
        'SELECT id, stock FROM products WHERE id = $1 FOR UPDATE',
        [id]
      );

      if (!productResult.rows.length) {
        throw Object.assign(new Error('Producto no encontrado.'), { status: 404 });
      }

      const product = productResult.rows[0];
      const newStock = product.stock + parseInt(change_amount);

      if (newStock < 0) {
        throw Object.assign(new Error('Stock insuficiente.'), { status: 400 });
      }

      const updatedProduct = await client.query(
        'UPDATE products SET stock = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [newStock, id]
      );

      await client.query(
        `INSERT INTO stock_log (product_id, user_id, change_amount, reason, stock_after)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, req.user.id, parseInt(change_amount), reason || null, newStock]
      );

      return updatedProduct.rows[0];
    });

    res.json({ product: result });
  } catch (err) {
    next(err);
  }
};

// ─── Get Stock Log (receptionist/admin) ──────────────────────────────────────
const getStockLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      `SELECT sl.*, u.name AS changed_by
       FROM stock_log sl
       LEFT JOIN users u ON u.id = sl.user_id
       WHERE sl.product_id = $1
       ORDER BY sl.created_at DESC
       LIMIT 50`,
      [id]
    );

    res.json({ log: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getStockLog,
};
