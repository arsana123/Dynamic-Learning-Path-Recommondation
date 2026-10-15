export default function ProgressBar({ 
  value, 
  max = 100, 
  size = 'md',
  showLabel = false,
  className = '' 
}) {
  const percentage = Math.round((value / max) * 100);
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-zinc-300">Progress</span>
          <span className="text-sm text-teal-400 font-semibold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-zinc-800 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
