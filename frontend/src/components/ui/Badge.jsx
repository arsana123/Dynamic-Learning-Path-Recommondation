const variants = {
  default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  primary: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const difficultyColors = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function Badge({ 
  children, 
  variant = 'default', 
  difficulty,
  className = '' 
}) {
  const colorClass = difficulty ? difficultyColors[difficulty] : variants[variant];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClass} ${className}`}>
      {children}
    </span>
  );
}
