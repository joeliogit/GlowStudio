/**
 * Global error handling middleware.
 * Must be registered LAST in Express (after all routes).
 */
const errorHandler = (err, req, res, _next) => {
  const isDev = process.env.NODE_ENV !== 'production';

  // Log full error in development
  if (isDev) {
    console.error('\n  [ERROR]', err);
  }

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return res.status(409).json({ error: 'El registro ya existe.' });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referencia inválida en los datos enviados.' });
  }

  // PostgreSQL not-null violation
  if (err.code === '23502') {
    return res.status(400).json({ error: `El campo '${err.column}' es requerido.` });
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(422).json({
      error: 'Error de validación.',
      details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Archivo demasiado grande. Máximo 5MB.' });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor.';

  res.status(status).json({
    error: message,
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = errorHandler;
