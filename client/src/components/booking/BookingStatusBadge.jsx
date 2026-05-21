const STATUS_CONFIG = {
  pending: { label: 'Pendiente', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmada', className: 'bg-green-100 text-green-700 border-green-200' },
  completed: { label: 'Completada', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-600 border-red-200' },
  no_show: { label: 'No se presentó', className: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export default function BookingStatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const sizeClass = {
    xs: 'text-2xs px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  }[size] || 'text-xs px-2.5 py-1';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border font-medium whitespace-nowrap',
        sizeClass,
        config.className,
      ].join(' ')}
    >
      {config.label}
    </span>
  );
}
