import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  padding = true,
  glass = false,
  onClick,
  as: Tag = 'div',
  ...props
}) {
  const Component = onClick ? motion.div : Tag;

  return (
    <Component
      onClick={onClick}
      whileHover={hover && onClick ? { y: -4, boxShadow: '0 8px 40px rgba(233,30,140,0.16)' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={[
        'rounded-2xl border border-pink-100',
        glass ? 'bg-white/80 backdrop-blur-md' : 'bg-white',
        'shadow-card',
        hover && !onClick ? 'hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200' : '',
        onClick ? 'cursor-pointer' : '',
        padding ? 'p-5 sm:p-6' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
}
