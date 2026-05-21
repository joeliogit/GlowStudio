const { OAuth2Client } = require('google-auth-library');
const { GOOGLE_CLIENT_ID } = require('../config/env');

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Verifica el ID token (credential) que envía el frontend tras el
 * "Sign in with Google". Valida la firma contra las llaves públicas de
 * Google y que el `aud` coincida con nuestro Client ID.
 *
 * @param {string} credential - JWT id_token de Google Identity Services
 * @returns {Promise<{googleId:string,email:string,emailVerified:boolean,name:string,picture:string|null}>}
 * @throws {Error} con `.status` 503 si no está configurado, o error de verificación
 */
async function verifyGoogleToken(credential) {
  if (!GOOGLE_CLIENT_ID) {
    const err = new Error('El inicio de sesión con Google no está configurado en el servidor.');
    err.status = 503;
    throw err;
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return {
    googleId: payload.sub,
    email: (payload.email || '').toLowerCase().trim(),
    emailVerified: payload.email_verified === true,
    name: payload.name || payload.email,
    picture: payload.picture || null,
  };
}

module.exports = { verifyGoogleToken };
