'use client';

interface NightModeToggleProps {
  isNightMode: boolean;
  onToggle: () => void;
}

export default function NightModeToggle({ isNightMode, onToggle }: NightModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        fixed top-4 right-4 z-50
        flex items-center gap-2
        px-4 py-2
        rounded-full
        font-bold
        transition-all duration-300
        shadow-lg hover:shadow-xl
        ${isNightMode
          ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
          : 'bg-indigo-900 text-white hover:bg-indigo-800'
        }
      `}
    >
      {isNightMode ? (
        <>
          <span className="text-xl">☀️</span>
          <span className="hidden sm:inline">Day Mode</span>
        </>
      ) : (
        <>
          <span className="text-xl">🌙</span>
          <span className="hidden sm:inline">Night Mode</span>
        </>
      )}
    </button>
  );
}
