'use client';

import { useEffect, useState } from 'react';

interface Money {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  emoji: string;
  fontSize: number;
}

export default function MoneyRainCombo() {
  const [moneys, setMoneys] = useState<Money[]>([]);

  useEffect(() => {
    const moneyEmojis = ['💰', '💵', '💴', '💶', '💷', '🪙', '💎'];
    const items: Money[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 1.5 + Math.random() * 2,
      animationDelay: Math.random() * 0.5,
      emoji: moneyEmojis[Math.floor(Math.random() * moneyEmojis.length)],
      fontSize: 20 + Math.random() * 30,
    }));
    setMoneys(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {moneys.map((money) => (
        <div
          key={money.id}
          className="money-fall"
          style={{
            left: `${money.left}%`,
            animationDuration: `${money.animationDuration}s`,
            animationDelay: `${money.animationDelay}s`,
            fontSize: `${money.fontSize}px`,
          }}
        >
          {money.emoji}
        </div>
      ))}
    </div>
  );
}
