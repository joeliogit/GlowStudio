/**
 * Format a number as Mexican Pesos (MXN)
 * @param {number|string} amount
 * @param {boolean} compact - Use compact notation for large numbers
 */
export const formatCurrency = (amount, compact = false) => {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Format without currency symbol
 */
export const formatNumber = (amount) => {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Format as pesos with short notation
 */
export const formatPrice = (amount) => formatCurrency(amount);

/**
 * Parse a currency string back to number
 */
export const parseCurrency = (str) => {
  if (typeof str === 'number') return str;
  return parseFloat(str.replace(/[^0-9.-]/g, '')) || 0;
};
