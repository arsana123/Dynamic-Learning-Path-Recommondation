const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export default function Avatar({ 
  src, 
  alt = '', 
  name = '',
  size = 'md',
  className = '' 
}) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`rounded-full object-cover ring-2 ring-zinc-700 ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center rounded-full bg-teal-500/20 text-teal-400 font-medium ring-2 ring-zinc-700 ${sizes[size]} ${className}`}>
      {initials}
    </div>
  );
}
