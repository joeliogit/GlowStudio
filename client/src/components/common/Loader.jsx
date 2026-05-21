export default function Loader({ size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={[
        'rounded-full border-pink-200 border-t-pink-500 animate-spin',
        sizes[size] || sizes.md,
        className,
      ].join(' ')}
      role="status"
      aria-label="Cargando..."
    />
  );
}

export function LoaderPage({ message = 'Cargando...' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader size="lg" />
      <p className="text-sm text-gray-400 font-medium">{message}</p>
    </div>
  );
}
