export default function Card({ 
  children, 
  className = '', 
  hover = false,
  glow = false,
  ...props 
}) {
  return (
    <div
      className={`bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 ${hover ? 'transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80' : ''} ${glow ? 'shadow-xl shadow-teal-500/5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-5 border-b border-zinc-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`px-6 py-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-5 border-t border-zinc-800 ${className}`}>
      {children}
    </div>
  );
}
