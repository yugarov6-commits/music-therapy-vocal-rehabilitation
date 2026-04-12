import { useState } from 'react';

export default function ProfileSection() {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [freq, setFreq] = useState<'432' | '440'>('432');

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20" style={{ background: 'hsl(240, 22%, 5%)' }}>
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 font-body" style={{ color: 'hsl(245, 55%, 65%)' }}>
            Профиль
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light mb-4" style={{ color: 'hsl(45, 30%, 90%)' }}>
            Настройки
          </h2>
        </div>

        <div className="flex flex-col items-center mb-10">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4 animate-glow"
            style={{ background: 'linear-gradient(135deg, hsl(270,50%,35%), hsl(245,55%,45%))' }}
          >
            <span style={{ fontSize: '40px' }}>🎤</span>
          </div>
          <h3 className="font-display text-2xl mb-1" style={{ color: 'hsl(45, 30%, 90%)' }}>Ваш профиль</h3>
          <p className="text-sm font-body" style={{ color: 'hsl(240, 10%, 50%)' }}>Персонализация терапии</p>
        </div>

        <div className="rounded-3xl border p-6 mb-6" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}>
          <p className="text-xs tracking-widest uppercase mb-4 font-body" style={{ color: 'hsl(240, 10%, 45%)' }}>Статистика</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Всего сессий', value: '23', color: 'hsl(45, 70%, 65%)' },
              { label: 'Любимое настроение', value: '🌊 Покой', color: 'hsl(175, 55%, 45%)' },
              { label: 'Часов практики', value: '4.2', color: 'hsl(270, 50%, 65%)' },
              { label: 'Улучшение диапазона', value: '+12%', color: 'hsl(245, 55%, 65%)' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl" style={{ background: 'hsl(240, 20%, 7%)' }}>
                <div className="font-display text-2xl font-light mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs font-body" style={{ color: 'hsl(240, 10%, 50%)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border p-6" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}>
          <p className="text-xs tracking-widest uppercase mb-4 font-body" style={{ color: 'hsl(240, 10%, 45%)' }}>Настройки</p>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body font-medium" style={{ color: 'hsl(45, 20%, 85%)' }}>Напоминания</p>
                <p className="text-xs font-body" style={{ color: 'hsl(240, 10%, 50%)' }}>Ежедневная практика в 10:00</p>
              </div>
              <button
                onClick={() => setNotificationsOn(!notificationsOn)}
                className="relative w-12 h-6 rounded-full transition-all duration-300"
                style={{ background: notificationsOn ? 'hsl(175, 55%, 45%)' : 'hsl(240, 15%, 20%)' }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full transition-all duration-300"
                  style={{ left: notificationsOn ? '28px' : '4px', background: 'hsl(45, 30%, 92%)' }}
                />
              </button>
            </div>

            <div>
              <p className="text-sm font-body font-medium mb-2" style={{ color: 'hsl(45, 20%, 85%)' }}>Эталонная частота</p>
              <div className="flex gap-3">
                {(['432', '440'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFreq(f)}
                    className="flex-1 py-2 rounded-xl text-sm font-body transition-all"
                    style={{
                      background: freq === f ? 'hsl(45, 70%, 65%)' : 'hsl(240, 15%, 15%)',
                      color: freq === f ? 'hsl(240, 20%, 6%)' : 'hsl(240, 10%, 65%)',
                    }}
                  >
                    {f} Гц
                  </button>
                ))}
              </div>
              <p className="text-xs font-body mt-2" style={{ color: 'hsl(240, 10%, 40%)' }}>
                {freq === '432' ? '432 Гц — натуральная гармония, расслабление' : '440 Гц — стандарт A4, концертный строй'}
              </p>
            </div>

            <div>
              <p className="text-sm font-body font-medium mb-2" style={{ color: 'hsl(45, 20%, 85%)' }}>Голосовой диапазон</p>
              <div className="flex gap-2 flex-wrap">
                {['Бас', 'Баритон', 'Тенор', 'Альт', 'Сопрано'].map((v) => (
                  <span key={v} className="px-3 py-1 rounded-xl text-xs font-body" style={{ background: 'hsl(240, 15%, 15%)', color: 'hsl(240, 10%, 60%)' }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
