import Icon from '@/components/ui/icon';
import type { Exercise } from '@/components/exercises/exercise.types';
import type { useVoiceAnalyzer } from '@/components/exercises/useVoiceAnalyzer';
import ExerciseVoicePanel from '@/components/exercises/ExerciseVoicePanel';

type VoiceState = ReturnType<typeof useVoiceAnalyzer>;

type Props = {
  activeEx: Exercise;
  step: number;
  voice: VoiceState;
  onBack: () => void;
  onStepClick: (i: number) => void;
};

export default function ExerciseActiveView({
  activeEx,
  step,
  voice,
  onBack,
  onStepClick,
}: Props) {
  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-sm font-body transition-opacity hover:opacity-70"
        style={{ color: 'hsl(240, 10%, 55%)' }}
      >
        <Icon name="ChevronLeft" size={16} />
        Все упражнения
      </button>

      <div className="rounded-3xl border p-8" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${activeEx.color}20` }}>
            <Icon name={activeEx.icon as 'Wind' | 'Mic' | 'MessageCircle' | 'Radio' | 'HeartPulse' | 'Stethoscope'} size={26} style={{ color: activeEx.color }} />
          </div>
          <div>
            <h3 className="font-display text-3xl font-light" style={{ color: 'hsl(45, 30%, 90%)' }}>{activeEx.title}</h3>
            <p className="font-body text-sm" style={{ color: 'hsl(240, 10%, 55%)' }}>{activeEx.subtitle}</p>
          </div>
        </div>

        {/* Voice panel */}
        <ExerciseVoicePanel voice={voice} />

        {/* Exercise warning */}
        {activeEx.warning && (
          <div className="mb-6 p-4 rounded-2xl flex items-start gap-3" style={{ background: 'hsl(340, 60%, 15%, 0.5)', border: '1px solid hsl(340, 60%, 35%, 0.5)' }}>
            <Icon name="ShieldAlert" size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'hsl(340, 60%, 65%)' }} />
            <p className="text-sm font-body leading-relaxed" style={{ color: 'hsl(340, 40%, 75%)' }}>{activeEx.warning}</p>
          </div>
        )}

        {/* Steps */}
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase mb-3 font-body" style={{ color: 'hsl(240, 10%, 45%)' }}>
            {activeEx.subExercises ? 'Правила выполнения' : 'Техника'}
          </p>
          <div className="flex flex-col gap-2">
            {activeEx.steps.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{ background: step === i ? `${activeEx.color}15` : 'transparent' }}
                onClick={() => onStepClick(i)}
              >
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-body mt-0.5"
                  style={{
                    background: step === i ? activeEx.color : 'hsl(240, 15%, 15%)',
                    color: step === i ? 'hsl(240, 20%, 6%)' : 'hsl(240, 10%, 50%)',
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-sm font-body leading-relaxed" style={{ color: step === i ? 'hsl(45, 20%, 85%)' : 'hsl(240, 10%, 55%)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-exercises */}
        {activeEx.subExercises && (
          <div className="mb-8">
            <p className="text-xs tracking-widest uppercase mb-4 font-body" style={{ color: 'hsl(240, 10%, 45%)' }}>Комплекс упражнений</p>
            <div className="flex flex-col gap-3">
              {activeEx.subExercises.map((sub, i) => (
                <div key={i} className="rounded-2xl p-4" style={{ background: 'hsl(240, 20%, 7%)', border: '1px solid hsl(240, 15%, 15%)' }}>
                  <p className="font-body font-medium text-sm mb-2" style={{ color: activeEx.color }}>{sub.name}</p>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(240, 10%, 60%)' }}>{sub.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Forbidden */}
        {activeEx.forbidden && (
          <div className="mb-6 rounded-2xl p-4" style={{ background: 'hsl(240, 20%, 7%)', border: '1px solid hsl(240, 15%, 15%)' }}>
            <p className="text-xs tracking-widest uppercase mb-3 font-body" style={{ color: 'hsl(0, 60%, 55%)' }}>Нельзя</p>
            <div className="flex flex-col gap-2">
              {activeEx.forbidden.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: 'hsl(0, 60%, 55%)', fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>✕</span>
                  <p className="text-sm font-body leading-relaxed" style={{ color: 'hsl(240, 10%, 55%)' }}>{f}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regime */}
        {activeEx.regime && (
          <div className="mb-6 p-4 rounded-2xl flex items-start gap-3" style={{ background: `${activeEx.color}10`, border: `1px solid ${activeEx.color}25` }}>
            <Icon name="Leaf" size={16} className="flex-shrink-0 mt-0.5" style={{ color: activeEx.color }} />
            <p className="text-sm font-body leading-relaxed" style={{ color: 'hsl(240, 10%, 60%)' }}>{activeEx.regime}</p>
          </div>
        )}


      </div>
    </div>
  );
}