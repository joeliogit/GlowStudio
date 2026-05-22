const { query } = require('../config/db');
const { generateToken } = require('../utils/generateToken');
const { verifyGoogleToken } = require('../utils/googleVerify');

// ─── Asignación automática de rol por correo ─────────────────────────────────
// El acceso es exclusivamente con Google. El rol se decide por el email:
//   • recepcion121212@gmail.com   → recepción
//   • cuentaparaclaude24@gmail.com → administrador
//   • cualquier otro correo        → cliente
const ROLE_BY_EMAIL = {
  'recepcion121212@gmail.com': 'receptionist',
  'cuentaparaclaude24@gmail.com': 'admin',
};

const resolveRole = (email) => ROLE_BY_EMAIL[email] || 'client';

// ─── Google Sign-In ─────────────────────────────────────────────────────────────
// Verifica el id_token de Google e inicia (o crea) la sesión. El rol se
// sincroniza en cada login según `ROLE_BY_EMAIL`, de modo que los correos de
// recepción y administración siempre caen en su panel correspondiente.
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

    const role = resolveRole(profile.email);

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

      // Enlazamos el google_id la primera vez, rellenamos el avatar si faltaba y
      // sincronizamos el rol según el correo (recepción / admin / cliente).
      const updated = await query(
        `UPDATE users
            SET google_id = COALESCE(google_id, $1),
                avatar_url = COALESCE(avatar_url, $2),
                role = $3
          WHERE id = $4
          RETURNING id, name, email, phone, role, avatar_url, is_active`,
        [profile.googleId, profile.picture, role, user.id]
      );
      user = updated.rows[0];
    } else {
      // Email nuevo → cuenta sin password_hash (solo accede vía Google) con el
      // rol que le corresponde por su correo.
      const created = await query(
        `INSERT INTO users (name, email, role, avatar_url, google_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, phone, role, avatar_url, is_active`,
        [profile.name, profile.email, role, profile.picture, profile.googleId]
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

module.exports = { googleAuth, getMe, logout };
