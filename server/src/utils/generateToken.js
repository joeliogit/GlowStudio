const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

/**
 * Generate a signed JWT token embedding user identity and role.
 * @param {object} user - User record from database
 * @param {string} user.id
 * @param {string} user.email
 * @param {string} user.role
 * @returns {string} Signed JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

module.exports = { generateToken };
