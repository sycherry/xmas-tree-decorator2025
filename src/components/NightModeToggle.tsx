'use client';

interface NightModeToggleProps {
  isNightMode: boolean;
  onToggle: () => void;
}

export default function NightModeToggle({ isNightMode, onToggle }: NightModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden md:inline text-sm font-bold text-white drop-shadow-md">
        {isNightMode ? 'Night' : 'Day'}
      </span>
      <button
        onClick={onToggle}
        className={`
          relative w-16 h-8 md:w-20 md:h-10 rounded-full
          transition-all duration-300
          shadow-inner
          ${isNightMode
            ? 'bg-indigo-900'
            : 'bg-sky-400'
          }
        `}
      >
        {/* Background icons */}
        <span className="absolute left-1.5 md:left-2 top-1/2 -translate-y-1/2 text-sm md:text-base opacity-60">🌙</span>
        <span className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 text-sm md:text-base opacity-60">☀️</span>

        {/* Toggle knob */}
        <div
          className={`
            absolute top-1 w-6 h-6 md:w-8 md:h-8 rounded-full
            transition-all duration-300
            shadow-md
            flex items-center justify-center
            ${isNightMode
              ? 'left-1 bg-indigo-200'
              : 'left-9 md:left-11 bg-yellow-300'
            }
          `}
        >
          <span className="text-sm md:text-lg">{isNightMode ? '🌙' : '☀️'}</span>
        </div>
      </button>
    </div>
  );
}
