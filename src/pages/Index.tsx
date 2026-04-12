import { useState } from 'react';
import Icon from '@/components/ui/icon';
import MoodSection from '@/components/MoodSection';
import ExercisesSection from '@/components/ExercisesSection';
import DiarySection from '@/components/DiarySection';
import ProfileSection from '@/components/ProfileSection';

// ─── Onboarding ───────────────────────────────────────────────────────────────

const ONBOARDING_STEPS = [
  {
    icon: '🎵',
    color: 'hsl(175, 55%, 45%)',
    title: 'Музыкотерапия',
    desc: 'Программа подбирает треки под ваше текущее настроение — классику, эмбиент или неоклассику — чтобы мягко скорректировать эмоциональный фон.',
  },
  {
    icon: '🌬',
    color: 'hsl(270, 50%, 60%)',
    title: 'Музовокальная реабилитация',
    desc: 'Дыхательные упражнения на диафрагму и контроль выдоха, распевки для складок и артикуляция — шаг за шагом с инструкцией и таймером.',
  },
  {
    icon: '🎙',
    color: 'hsl(45, 70%, 65%)',
    title: 'Объективный контроль',
    desc: 'Если есть микрофон — приложение замеряет громкость в реальном времени и предупреждает о слишком тихом или форсированном голосе.',
  },
  {
    icon: '📓',
    color: 'hsl(245, 55%, 65%)',
    title: 'Дневник прогресса',
    desc: 'Каждая сессия сохраняется: эмоция, упражнение, длительность и уровень громкости. Наблюдайте, как голос меняется день за днём.',
  },
];

function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
      style={{ background: 'hsl(240, 20%, 5%)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${current.color}18 0%, transparent 65%)`,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-float absolute rounded-full"
            style={{
              width: `${4 + (i % 3) * 3}px`,
              height: `${4 + (i % 3) * 3}px`,
              left: `${15 + i * 14}%`,
              top: `${15 + (i % 3) * 20}%`,
              background: current.color,
              opacity: 0.25,
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${5 + i * 0.6}s`,
              transition: 'background 0.5s ease',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-12 opacity-70">
          <img
            src="https://cdn.poehali.dev/projects/d1e593c7-90a0-4811-9d31-204e6447efe5/bucket/fc9ee871-0ca0-42d2-83e2-e43815ed163b.jpg"
            alt="Artman"
            style={{ height: '36px', width: 'auto', filter: 'brightness(0) invert(1)', objectFit: 'contain' }}
          />
        </div>

        {/* Icon */}
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500"
          style={{
            background: `${current.color}18`,
            border: `1.5px solid ${current.color}40`,
            boxShadow: `0 0 40px ${current.color}25`,
          }}
        >
          <span className="transition-all duration-300" style={{ fontSize: '52px' }}>{current.icon}</span>
        </div>

        {/* Text */}
        <h2
          className="font-display text-3xl font-light mb-4 transition-all duration-300"
          style={{ color: 'hsl(45, 30%, 92%)' }}
        >
          {current.title}
        </h2>
        <p
          className="font-body text-sm leading-relaxed mb-10 transition-all duration-300"
          style={{ color: 'hsl(240, 10%, 58%)' }}
        >
          {current.desc}
        </p>

        {/* Step dots */}
        <div className="flex gap-2 mb-8">
          {ONBOARDING_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? '24px' : '6px',
                height: '6px',
                background: i === step ? current.color : 'hsl(240, 15%, 22%)',
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => isLast ? onDone() : setStep(s => s + 1)}
            className="w-full py-4 rounded-2xl font-body font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: current.color, color: 'hsl(240, 20%, 6%)' }}
          >
            {isLast ? 'Начать практику' : 'Далее'}
          </button>
          {!isLast && (
            <button
              onClick={onDone}
              className="w-full py-3 font-body text-sm transition-opacity hover:opacity-70"
              style={{ color: 'hsl(240, 10%, 40%)' }}
            >
              Пропустить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'mood', label: 'Настроение', icon: 'Heart' },
  { id: 'exercises', label: 'Упражнения', icon: 'Mic' },
  { id: 'diary', label: 'Дневник', icon: 'BookOpen' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
] as const;

// ─── App ──────────────────────────────────────────────────────────────────────

export default function Index() {
  const [active, setActive] = useState<string>('mood');
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('resonance_onboarded');
  });

  const handleOnboardingDone = () => {
    localStorage.setItem('resonance_onboarded', '1');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'hsl(235, 25%, 5%)' }}>
      {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background: 'hsl(235, 25%, 5%, 0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid hsl(270, 30%, 20%, 0.5)',
          boxShadow: '0 1px 40px hsl(270, 55%, 15%, 0.3)',
        }}
      >
        <div className="flex items-center">
          <img
            src="https://cdn.poehali.dev/projects/d1e593c7-90a0-4811-9d31-204e6447efe5/bucket/fc9ee871-0ca0-42d2-83e2-e43815ed163b.jpg"
            alt="Artman"
            style={{ height: '40px', width: 'auto', filter: 'brightness(0) invert(1)', objectFit: 'contain' }}
          />
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl" style={{ background: 'hsl(235, 22%, 10%)', border: '1px solid hsl(270, 30%, 18%)' }}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-body transition-all duration-300"
              style={{
                background: active === s.id
                  ? 'linear-gradient(135deg, hsl(270,40%,20%), hsl(235,30%,18%))'
                  : 'transparent',
                color: active === s.id ? 'hsl(45, 85%, 72%)' : 'hsl(240, 10%, 48%)',
                boxShadow: active === s.id ? '0 2px 12px hsl(270,55%,20%,0.4)' : 'none',
              }}
            >
              <Icon name={s.icon} size={14} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Decorative right dot */}
        <div className="hidden md:block w-2 h-2 rounded-full animate-glow" style={{ background: 'hsl(45,85%,62%)' }} />
      </header>

      <main className="pt-16 relative z-10">
        {active === 'mood' && <MoodSection />}
        {active === 'exercises' && <ExercisesSection />}
        {active === 'diary' && <DiarySection />}
        {active === 'profile' && <ProfileSection />}
      </main>

      {/* Mobile nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
        style={{
          background: 'hsl(235, 25%, 6%, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid hsl(270, 30%, 18%, 0.6)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -4px 30px hsl(270, 55%, 10%, 0.5)',
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className="flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-250 relative"
          >
            {active === s.id && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{ background: 'hsl(45,85%,62%)', boxShadow: '0 0 8px hsl(45,85%,62%)' }} />
            )}
            <Icon name={s.icon} size={20} style={{ color: active === s.id ? 'hsl(45, 85%, 65%)' : 'hsl(240, 10%, 38%)' }} />
            <span className="text-[10px] font-body" style={{ color: active === s.id ? 'hsl(45, 85%, 65%)' : 'hsl(240, 10%, 38%)' }}>
              {s.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
