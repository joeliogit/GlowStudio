/**
 * Format a date string to a localized Spanish date
 * @param {string|Date} date
 * @param {Intl.DateTimeFormatOptions} options
 */
export const formatDate = (date, options = {}) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
};

/**
 * Format a date to short form: 15 ene. 2025
 */
export const formatDateShort = (date) =>
  formatDate(date, { month: 'short', year: 'numeric', day: 'numeric' });

/**
 * Format a date to full weekday form
 */
export const formatDateFull = (date) =>
  formatDate(date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

/**
 * Format a time string (HH:MM:SS) to 12h format
 */
export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes), 0);
  return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format appointment date + time together
 */
export const formatAppointment = (date, time) => {
  if (!date) return '';
  const dateStr = formatDateFull(date);
  const timeStr = time ? ` a las ${formatTime(time)}` : '';
  return `${dateStr}${timeStr}`;
};

/**
 * Return relative time label (Hoy, Mañana, or date)
 */
export const relativeDate = (date) => {
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, today)) return 'Hoy';
  if (isSameDay(d, tomorrow)) return 'Mañana';
  return formatDateShort(d);
};
