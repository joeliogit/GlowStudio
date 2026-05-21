const { query } = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');
const { verifyGoogleToken } = require('../utils/googleVerify');

// ─── Register ─────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    // Check existing user
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'El email ya está registrado.' });
    }

    const password_hash = await hashPassword(password);

    const result = await query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'client')
       RETURNING id, name, email, phone, role, avatar_url, created_at`,
      [name.trim(), email.toLowerCase().trim(), phone || null, password_hash]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
    }

    const result = await query(
      'SELECT id, name, email, phone, password_hash, role, avatar_url, is_active FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'Tu cuenta está desactivada. Contacta a soporte.' });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const { password_hash, ...safeUser } = user;
    const token = generateToken(safeUser);

    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
};

// ─── Google Sign-In ─────────────────────────────────────────────────────────────
// Verifica el id_token de Google y resuelve la sesión SIN tocar el sistema de
// roles existente:
//   • Si el email ya tiene cuenta (client / receptionist / admin) → inicia sesión
//     con ESE rol (solo enlaza el google_id la primera vez).
//   • Si es un email nuevo → crea la cuenta con rol 'client' (misma política que
//     el registro público; recepcionista/admin se siguen gestionando en la DB).
const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Falta el token de Google.' });
    }

    let profile;
    try {
      profile = await verifyGoogleToken(credential);
    } catch (err) {
      if (err.status === 503) return res.status(503).json({ error: err.message });
      return res.status(401).json({ error: 'No se pudo verificar tu cuenta de Google.' });
    }

    if (!profile.email || !profile.emailVerified) {
      return res.status(401).json({ error: 'Tu cuenta de Google no tiene un email verificado.' });
    }

    // Buscar por google_id (logins posteriores) o por email (enlazar cuenta existente)
    const found = await query(
      `SELECT id, name, email, phone, role, avatar_url, is_active, google_id
         FROM users
        WHERE google_id = $1 OR email = $2`,
      [profile.googleId, profile.email]
    );

    let user;

    if (found.rows.length) {
      user = found.rows[0];

      if (!user.is_active) {
        return res.status(403).json({ error: 'Tu cuenta está desactivada. Contacta a soporte.' });
      }

      // Primer login con Google sobre una cuenta existente: enlazamos el google_id
      // y rellenamos el avatar si faltaba. El ROL nunca se modifica aquí.
      if (!user.google_id) {
        const updated = await query(
          `UPDATE users
              SET google_id = $1,
                  avatar_url = COALESCE(avatar_url, $2)
            WHERE id = $3
            RETURNING id, name, email, phone, role, avatar_url, is_active`,
          [profile.googleId, profile.picture, user.id]
        );
        user = updated.rows[0];
      }
    } else {
      // Email nuevo → cuenta de cliente (sin password_hash; solo accede vía Google)
      const created = await query(
        `INSERT INTO users (name, email, role, avatar_url, google_id)
         VALUES ($1, $2, 'client', $3, $4)
         RETURNING id, name, email, phone, role, avatar_url, is_active`,
        [profile.name, profile.email, profile.picture, profile.googleId]
      );
      user = created.rows[0];
    }

    const { google_id, ...safeUser } = user;
    const token = generateToken(safeUser);

    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, email, phone, role, avatar_url, is_active, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── Logout (stateless JWT — client discards token) ───────────────────────────
const logout = (_req, res) => {
  res.json({ message: 'Sesión cerrada correctamente.' });
};

module.exports = { register, login, googleAuth, getMe, logout };
