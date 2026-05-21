/**
 * requireRole(...roles) — middleware factory that allows only the specified roles.
 * Must be used AFTER the protect middleware.
 *
 * @param {...string} roles - Allowed roles: 'client', 'receptionist', 'admin'
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}.`,
      });
    }

    next();
  };
};

module.exports = { requireRole };
