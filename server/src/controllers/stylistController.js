const { query } = require('../config/db');

// ─── Get All Stylists ─────────────────────────────────────────────────────────
const getStylists = async (req, res, next) => {
  try {
    const { active_only = 'true' } = req.query;

    let whereClause = active_only === 'true' ? 'WHERE is_active = true' : '';

    const { rows } = await query(
      `SELECT * FROM stylists ${whereClause} ORDER BY name ASC`
    );

    res.json({ stylists: rows });
  } catch (err) {
    next(err);
  }
};

// ─── Get Stylist By ID ────────────────────────────────────────────────────────
const getStylistById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await query('SELECT * FROM stylists WHERE id = $1', [id]);

    if (!rows.length) {
      return res.status(404).json({ error: 'Estilista no encontrada.' });
    }

    // Get recent bookings count (public metric)
    const statsResult = await query(
      `SELECT COUNT(*) AS total_bookings
       FROM bookings
       WHERE stylist_id = $1 AND status = 'completed'`,
      [id]
    );

    res.json({
      stylist: rows[0],
      stats: { completed_bookings: parseInt(statsResult.rows[0].total_bookings) },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Create Stylist (admin) ───────────────────────────────────────────────────
const createStylist = async (req, res, next) => {
  try {
    const { name, bio, specialty, photo_url, instagram_handle } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre es requerido.' });
    }

    const { rows } = await query(
      `INSERT INTO stylists (name, bio, specialty, photo_url, instagram_handle)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, bio || null, specialty || null, photo_url || null, instagram_handle || null]
    );

    res.status(201).json({ stylist: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── Update Stylist (admin) ───────────────────────────────────────────────────
const updateStylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, bio, specialty, photo_url, instagram_handle, is_active } = req.body;

    const { rows } = await query(
      `UPDATE stylists
       SET name = COALESCE($1, name),
           bio = COALESCE($2, bio),
           specialty = COALESCE($3, specialty),
           photo_url = COALESCE($4, photo_url),
           instagram_handle = COALESCE($5, instagram_handle),
           is_active = COALESCE($6, is_active),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, bio, specialty, photo_url, instagram_handle, is_active, id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Estilista no encontrada.' });
    }

    res.json({ stylist: rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStylists, getStylistById, createStylist, updateStylist };
