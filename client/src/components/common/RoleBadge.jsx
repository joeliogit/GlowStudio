const ROLE_CONFIG = {
  client: {
    label: 'Clienta',
    className: 'bg-pink-100 text-pink-700 border-pink-200',
  },
  receptionist: {
    label: 'Recepcionista',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  admin: {
    label: 'Admin',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
};

export default function RoleBadge({ role, size = 'sm' }) {
  if (!role) return null;
  const config = ROLE_CONFIG[role] || { label: role, className: 'bg-gray-100 text-gray-700 border-gray-200' };

  const sizeClass = size === 'xs' ? 'text-2xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border font-medium',
        sizeClass,
        config.className,
      ].join(' ')}
    >
      {config.label}
    </span>
  );
}
