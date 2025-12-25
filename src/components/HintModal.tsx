'use client';

interface HintModalProps {
  onClose: () => void;
}

export default function HintModal({ onClose }: HintModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-b from-green-50 to-red-50 rounded-2xl p-6 max-w-sm w-full shadow-2xl border-4 border-gold animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl hover:scale-110 transition-transform"
        >
          ❌
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-4 text-green-800">
          🎄 Combo Hints 🎄
        </h2>

        {/* Hints */}
        <div className="space-y-3">
          <div className="bg-white/80 rounded-lg p-3 shadow">
            <div className="text-3xl text-center">❄️ + ⛄ = ?</div>
          </div>

          <div className="bg-white/80 rounded-lg p-3 shadow">
            <div className="text-3xl text-center">🦌 + 🎅 = ?</div>
          </div>

          <div className="bg-white/80 rounded-lg p-3 shadow">
            <div className="text-3xl text-center">🎅 + 🎁 = ?</div>
          </div>

          <div className="bg-white/80 rounded-lg p-3 shadow">
            <div className="text-3xl text-center">💎 + 💎 = ?</div>
          </div>

          <div className="bg-white/80 rounded-lg p-3 shadow">
            <div className="text-3xl text-center">👾 + 🎮 = ?</div>
          </div>

          <div className="bg-white/80 rounded-lg p-3 shadow">
            <div className="text-3xl text-center">📷 + 👽 = ?</div>
          </div>
        </div>
      </div>
    </div>
  );
}
