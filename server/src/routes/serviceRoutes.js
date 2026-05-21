const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// GET /api/services  (public)
router.get('/', async (req, res, next) => {
  try {
    const { category, active_only = 'true' } = req.query;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (active_only === 'true') whereClause += ' AND is_active = true';
    if (category) {
      params.push(category);
      whereClause += ` AND category = $${params.length}`;
    }

    const { rows } = await query(
      `SELECT * FROM services ${whereClause} ORDER BY category, name`,
      params
    );
    res.json({ services: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/services/:id  (public)
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM services WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Servicio no encontrado.' });
    res.json({ service: rows[0] });
  } catch (err) {
    next(err);
  }
});

// POST /api/services  (admin)
router.post('/', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const { name, description, category, price, duration_minutes, image_url } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos.' });
    }
    const { rows } = await query(
      `INSERT INTO services (name, description, category, price, duration_minutes, image_url)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, description || null, category, price, duration_minutes || 60, image_url || null]
    );
    res.status(201).json({ service: rows[0] });
  } catch (err) {
    next(err);
  }
});

// PUT /api/services/:id  (admin)
router.put('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const { name, description, category, price, duration_minutes, image_url, is_active } = req.body;
    const { rows } = await query(
      `UPDATE services
       SET name = COALESCE($1, name), description = COALESCE($2, description),
           category = COALESCE($3, category), price = COALESCE($4, price),
           duration_minutes = COALESCE($5, duration_minutes), image_url = COALESCE($6, image_url),
           is_active = COALESCE($7, is_active), updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [name, description, category, price, duration_minutes, image_url, is_active, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Servicio no encontrado.' });
    res.json({ service: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
