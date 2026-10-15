const variants = {
  primary: 'bg-teal-500 text-white hover:bg-teal-400 focus:ring-teal-500 shadow-lg shadow-teal-500/25',
  secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus:ring-zinc-600 border border-zinc-700',
  outline: 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white focus:ring-zinc-600',
  ghost: 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus:ring-zinc-600',
  danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-4 text-base',
};

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
