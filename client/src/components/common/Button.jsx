import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 shadow-md hover:shadow-glow',
  secondary: 'bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-200',
  outline: 'border-2 border-pink-500 text-pink-500 hover:bg-pink-50',
  ghost: 'text-pink-500 hover:bg-pink-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  white: 'bg-white text-pink-600 hover:bg-pink-50 shadow-md',
  purple: 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 shadow-md hover:shadow-glow-purple',
  'purple-secondary': 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200',
  'purple-outline': 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
  blue: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-glow-blue',
  'blue-secondary': 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-2xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    leftIcon,
    rightIcon,
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-200 select-none',
        'focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        isDisabled && 'opacity-60 cursor-not-allowed',
        fullWidth && 'w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
});

export default Button;
