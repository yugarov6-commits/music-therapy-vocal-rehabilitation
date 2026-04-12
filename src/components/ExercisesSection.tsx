import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { EXERCISES } from '@/components/exercises/exercise.types';
import type { Exercise } from '@/components/exercises/exercise.types';
import { useVoiceAnalyzer } from '@/components/exercises/useVoiceAnalyzer';
import ExerciseActiveView from '@/components/exercises/ExerciseActiveView';

export default function ExercisesSection() {
  const [activeEx, setActiveEx] = useState<Exercise | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voice = useVoiceAnalyzer();

  const startEx = (ex: Exercise) => {
    setActiveEx(ex);
    setTimeLeft(ex.duration);
    setRunning(false);
    setStep(0);
    voice.stop();
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const toggleTimer = () => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
      voice.stop();
    } else {
      setRunning(true);
      voice.start();
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            voice.stop();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const progress = activeEx ? ((activeEx.duration - timeLeft) / activeEx.duration) * 100 : 0;

  const handleBack = () => {
    setActiveEx(null);
    setRunning(false);
    voice.stop();
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20" style={{ background: 'hsl(240, 22%, 5%)' }}>
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 font-body" style={{ color: 'hsl(270, 50%, 65%)' }}>
            Музовокальная реабилитация
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light mb-4" style={{ color: 'hsl(45, 30%, 90%)' }}>
            Упражнения
          </h2>
          <p className="font-body text-base" style={{ color: 'hsl(240, 10%, 55%)' }}>
            Тренировки с анализом голоса в реальном времени
          </p>
        </div>

        {!activeEx ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXERCISES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => startEx(ex)}
                className="card-glow text-left p-6 rounded-3xl border transition-all"
                style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${ex.color}20` }}>
                    <Icon name={ex.icon as 'Wind' | 'Mic' | 'MessageCircle' | 'Radio' | 'HeartPulse' | 'Stethoscope'} size={22} style={{ color: ex.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-medium mb-1" style={{ color: 'hsl(45, 20%, 88%)' }}>{ex.title}</h3>
                    <p className="text-sm font-body mb-3" style={{ color: 'hsl(240, 10%, 50%)' }}>{ex.subtitle}</p>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={12} style={{ color: ex.color }} />
                      <span className="text-xs font-body" style={{ color: ex.color }}>{fmt(ex.duration)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <ExerciseActiveView
            activeEx={activeEx}
            timeLeft={timeLeft}
            running={running}
            step={step}
            progress={progress}
            voice={voice}
            fmt={fmt}
            onBack={handleBack}
            onStepClick={setStep}
            onToggleTimer={toggleTimer}
          />
        )}
      </div>
    </section>
  );
}
