import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { EXERCISES } from '@/components/exercises/exercise.types';
import type { Exercise } from '@/components/exercises/exercise.types';
import ExerciseActiveView from '@/components/exercises/ExerciseActiveView';

const TRACK = {
  url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2001.mp3',
  title: 'Meditation Impromptu 01',
  author: 'Kevin MacLeod (CC BY 4.0)',
};

function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <div
      className="flex items-center gap-4 px-5 py-3 rounded-2xl mb-8"
      style={{ background: 'hsl(240, 18%, 9%)', border: '1px solid hsl(240, 15%, 18%)' }}
    >
      <audio ref={audioRef} src={TRACK.url} preload="none" />

      <button
        onClick={toggle}
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:opacity-80"
        style={{ background: 'hsl(270, 50%, 35%)' }}
      >
        <Icon name={playing ? 'Pause' : 'Play'} size={16} style={{ color: 'hsl(45, 85%, 75%)' }} />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-body font-medium truncate" style={{ color: 'hsl(45, 20%, 80%)' }}>{TRACK.title}</p>
        <p className="text-[10px] font-body truncate" style={{ color: 'hsl(240, 10%, 40%)' }}>{TRACK.author}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Icon name="Volume2" size={13} style={{ color: 'hsl(240, 10%, 45%)' }} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="w-20 accent-purple-400"
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}

export default function ExercisesSection() {
  const [activeEx, setActiveEx] = useState<Exercise | null>(null);
  const [step, setStep] = useState(0);

  const startEx = (ex: Exercise) => {
    setActiveEx(ex);
    setStep(0);
  };

  const handleBack = () => {
    setActiveEx(null);
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
            Техника и методика вокально-речевой реабилитации
          </p>
        </div>

        <MusicPlayer />

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
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: ex.color.replace(')', ', 0.15)').replace('hsl(', 'hsla(') }}>
                    <Icon name={ex.icon} fallback="Star" size={22} style={{ color: ex.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-medium mb-1" style={{ color: 'hsl(45, 20%, 88%)' }}>{ex.title}</h3>
                    <p className="text-sm font-body" style={{ color: 'hsl(240, 10%, 50%)' }}>{ex.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <ExerciseActiveView
            activeEx={activeEx}
            step={step}
            onBack={handleBack}
            onStepClick={setStep}
          />
        )}
      </div>
    </section>
  );
}
