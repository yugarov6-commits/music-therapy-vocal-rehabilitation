import { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';

// ─── Types ───────────────────────────────────────────────────────────────────

type Mood = {
  id: string;
  emoji: string;
  label: string;
  color: string;
  desc: string;
  tracks: Track[];
};

type Track = {
  title: string;
  composer: string;
  genre: string;
  duration: string;
  freq: string;
};

type Exercise = {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  icon: string;
  steps: string[];
  color: string;
};

type DiaryEntry = {
  id: string;
  date: string;
  mood: string;
  moodEmoji: string;
  exercise: string;
  duration: number;
  avgDb: number;
  note: string;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const MOODS: Mood[] = [
  {
    id: 'calm',
    emoji: '🌊',
    label: 'Спокойствие',
    color: 'hsl(175, 55%, 45%)',
    desc: 'Умиротворение и тишина',
    tracks: [
      { title: 'Gymnopédie No.1', composer: 'Эрик Сати', genre: 'Неоклассика', duration: '3:04', freq: '432 Гц' },
      { title: 'Clair de Lune', composer: 'Клод Дебюсси', genre: 'Классика', duration: '5:12', freq: '528 Гц' },
      { title: 'Experience', composer: 'Людовико Эйнауди', genre: 'Неоклассика', duration: '5:13', freq: '432 Гц' },
    ]
  },
  {
    id: 'anxious',
    emoji: '🌀',
    label: 'Тревога',
    color: 'hsl(270, 50%, 55%)',
    desc: 'Успокоить бурю внутри',
    tracks: [
      { title: 'Spiegel im Spiegel', composer: 'Арво Пярт', genre: 'Минимализм', duration: '10:10', freq: '528 Гц' },
      { title: 'Weightless', composer: 'Marconi Union', genre: 'Эмбиент', duration: '8:09', freq: '60 BPM' },
      { title: 'Opus 23', composer: 'Нильс Фрам', genre: 'Неоклассика', duration: '4:48', freq: '432 Гц' },
    ]
  },
  {
    id: 'sad',
    emoji: '🌧',
    label: 'Грусть',
    color: 'hsl(210, 50%, 50%)',
    desc: 'Принять и отпустить',
    tracks: [
      { title: 'Adagio for Strings', composer: 'Сэмюэл Барбер', genre: 'Классика', duration: '9:32', freq: '432 Гц' },
      { title: 'River Flows in You', composer: 'Юндзи Ли', genre: 'Неоклассика', duration: '3:45', freq: '432 Гц' },
      { title: "Comptine d'un autre été", composer: 'Янн Тирсен', genre: 'Кино', duration: '2:31', freq: '432 Гц' },
    ]
  },
  {
    id: 'energetic',
    emoji: '⚡',
    label: 'Энергия',
    color: 'hsl(45, 70%, 65%)',
    desc: 'Подъём и вдохновение',
    tracks: [
      { title: 'The Four Seasons: Spring', composer: 'Вивальди', genre: 'Барокко', duration: '11:02', freq: '440 Гц' },
      { title: 'Beethoven 5th', composer: 'Людвиг ван Бетховен', genre: 'Классика', duration: '7:22', freq: '440 Гц' },
      { title: 'Divenire', composer: 'Людовико Эйнауди', genre: 'Неоклассика', duration: '6:40', freq: '440 Гц' },
    ]
  },
  {
    id: 'focused',
    emoji: '🎯',
    label: 'Фокус',
    color: 'hsl(245, 55%, 60%)',
    desc: 'Ясность и концентрация',
    tracks: [
      { title: 'Bach Cello Suite No.1', composer: 'И.С. Бах', genre: 'Барокко', duration: '23:30', freq: '432 Гц' },
      { title: 'Metamorphosis Two', composer: 'Филип Гласс', genre: 'Минимализм', duration: '5:31', freq: '432 Гц' },
      { title: 'On the Nature of Daylight', composer: 'Макс Рихтер', genre: 'Неоклассика', duration: '7:01', freq: '432 Гц' },
    ]
  },
  {
    id: 'joyful',
    emoji: '✨',
    label: 'Радость',
    color: 'hsl(35, 80%, 60%)',
    desc: 'Лёгкость и свет',
    tracks: [
      { title: 'Piano Concerto No.21', composer: 'Моцарт', genre: 'Классика', duration: '8:15', freq: '440 Гц' },
      { title: "La Valse d'Amélie", composer: 'Янн Тирсен', genre: 'Кино', duration: '3:07', freq: '440 Гц' },
      { title: 'I Giorni', composer: 'Людовико Эйнауди', genre: 'Неоклассика', duration: '5:37', freq: '440 Гц' },
    ]
  },
];

const EXERCISES: Exercise[] = [
  {
    id: 'breath',
    title: 'Диафрагмальное дыхание',
    subtitle: 'Основа голоса',
    duration: 180,
    icon: 'Wind',
    color: 'hsl(175, 55%, 45%)',
    steps: [
      'Положите руку на живот',
      'Вдох носом 4 секунды — живот выходит вперёд',
      'Задержка 2 секунды',
      'Выдох ртом 6 секунд — живот уходит назад',
      'Повторите 10 раз',
    ]
  },
  {
    id: 'warmup',
    title: 'Распевка связок',
    subtitle: 'Разогрев и эластичность',
    duration: 240,
    icon: 'Mic',
    color: 'hsl(270, 50%, 55%)',
    steps: [
      'Гудение с закрытым ртом на ноте «мм»',
      'Скользящее «хм» вверх и вниз по диапазону',
      'Слоги «ма-ме-ми-мо-му» на одной ноте',
      'Трель губами (моторный звук) 30 секунд',
      'Постепенно расширяйте диапазон',
    ]
  },
  {
    id: 'articulation',
    title: 'Артикуляция',
    subtitle: 'Чёткость и дикция',
    duration: 120,
    icon: 'MessageCircle',
    color: 'hsl(45, 70%, 65%)',
    steps: [
      'Широко открывайте рот на каждый гласный',
      'Скороговорка: «Карл у Клары» — медленно, затем быстрее',
      'Вытягивание губ «у» — растягивание «и» — 20 повторений',
      'Жевательные движения с включённым звуком «ммм»',
      'Чёткое произношение согласных: т, д, н, л',
    ]
  },
  {
    id: 'resonance',
    title: 'Резонанс и проекция',
    subtitle: 'Сила без напряжения',
    duration: 200,
    icon: 'Radio',
    color: 'hsl(245, 55%, 60%)',
    steps: [
      'Ощутите вибрацию в груди, произнося «вввв»',
      'Переведите вибрацию в голову: «ннн» высоко',
      'Чередуйте грудной и головной резонаторы',
      'Проекция: говорите как будто к дальней стене',
      'Найдите баланс между усилием и свободой',
    ]
  },
];

// ─── Wave Background ──────────────────────────────────────────────────────────

function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '40%' }}
      >
        <path
          className="animate-wave"
          d="M0,160 C180,200 360,100 540,140 C720,180 900,80 1080,120 C1260,160 1380,200 1440,180 L1440,320 L0,320 Z"
          fill="hsl(270, 50%, 15%, 0.3)"
        />
        <path
          className="animate-wave-2"
          d="M0,200 C200,160 400,240 600,200 C800,160 1000,240 1200,200 C1320,180 1400,210 1440,220 L1440,320 L0,320 Z"
          fill="hsl(245, 55%, 20%, 0.25)"
        />
        <path
          d="M0,250 C300,220 600,270 900,250 C1100,240 1300,260 1440,255 L1440,320 L0,320 Z"
          fill="hsl(240, 20%, 10%, 0.4)"
        />
      </svg>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="animate-float absolute rounded-full"
          style={{
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            left: `${10 + i * 11}%`,
            top: `${20 + (i % 4) * 15}%`,
            background: i % 2 === 0 ? 'hsl(45, 70%, 65%, 0.4)' : 'hsl(270, 50%, 70%, 0.3)',
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${5 + i * 0.5}s`,
          }}
        />
      ))}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, hsl(270,50%,30%,0.06) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

// ─── Music Bars ───────────────────────────────────────────────────────────────

function MusicBars({ playing = false, color = 'hsl(45,70%,65%)' }: { playing?: boolean; color?: string }) {
  return (
    <div className="flex items-end gap-[3px]" style={{ height: '24px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`rounded-full ${playing ? `bar-${i}` : ''}`}
          style={{
            width: '3px',
            height: playing ? undefined : `${20 + i * 10}%`,
            minHeight: '4px',
            background: color,
            opacity: playing ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
}

// ─── VU Meter ─────────────────────────────────────────────────────────────────

function VUMeter({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs" style={{ color: 'hsl(240, 10%, 55%)' }}>
        <span>{label}</span>
        <span style={{ color }}>{Math.round(value)}</span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: '6px', background: 'hsl(240, 15%, 15%)' }}>
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, hsl(45,70%,75%))` }}
        />
      </div>
    </div>
  );
}

// ─── Waveform Visualizer ──────────────────────────────────────────────────────

function WaveformVisualizer({ analyser, isActive }: { analyser: AnalyserNode | null; isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      if (analyser && isActive) {
        const bufLen = analyser.frequencyBinCount;
        const dataArr = new Uint8Array(bufLen);
        analyser.getByteTimeDomainData(dataArr);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'hsl(45, 70%, 65%)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'hsl(45, 70%, 65%)';
        ctx.beginPath();
        const sliceW = W / bufLen;
        let x = 0;
        for (let i = 0; i < bufLen; i++) {
          const v = dataArr[i] / 128.0;
          const y = (v * H) / 2;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          x += sliceW;
        }
        ctx.lineTo(W, H / 2);
        ctx.stroke();
      } else {
        const t = Date.now() / 1000;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'hsl(270, 50%, 50%, 0.4)';
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
          const y = H / 2 + Math.sin(x / 30 + t) * 12 + Math.sin(x / 15 + t * 1.5) * 5;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [analyser, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={80}
      className="w-full rounded-lg"
      style={{ background: 'hsl(240, 18%, 8%)' }}
    />
  );
}

// ─── Voice Analyzer Hook ──────────────────────────────────────────────────────

function useVoiceAnalyzer() {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new AudioContext();
      contextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 2048;
      source.connect(analyserNode);
      setAnalyser(analyserNode);
      setIsListening(true);

      intervalRef.current = setInterval(() => {
        const buf = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(buf);
        const rms = Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
        setVolume(rms);
        let maxVal = 0; let maxIdx = 0;
        buf.forEach((v, i) => { if (v > maxVal) { maxVal = v; maxIdx = i; } });
        const freq = (maxIdx * audioCtx.sampleRate) / analyserNode.fftSize;
        setPitch(Math.round(freq));
        if (rms > 100) setWarning('Слишком громко! Снизьте интенсивность');
        else if (rms > 5 && rms < 20) setWarning('Очень тихо — добавьте поддержку дыхания');
        else setWarning(null);
      }, 200);
    } catch {
      setWarning('Нет доступа к микрофону');
    }
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    contextRef.current?.close();
    setIsListening(false);
    setVolume(0);
    setPitch(0);
    setWarning(null);
    setAnalyser(null);
  }, []);

  return { isListening, volume, pitch, warning, analyser, start, stop };
}

// ─── Section: Mood ────────────────────────────────────────────────────────────

function MoodSection() {
  const [selected, setSelected] = useState<Mood | null>(null);
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <WaveBackground />
      <div className="relative z-10 w-full max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 font-body" style={{ color: 'hsl(45, 70%, 65%)' }}>
            Диагностика
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light mb-4" style={{ color: 'hsl(45, 30%, 90%)' }}>
            Как вы себя чувствуете?
          </h2>
          <p className="font-body text-base" style={{ color: 'hsl(240, 10%, 55%)' }}>
            Выберите настроение — получите персональный музыкальный подбор
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => { setSelected(mood); setPlayingTrack(null); }}
              className={`mood-btn flex flex-col items-center gap-2 p-4 rounded-2xl border ${selected?.id === mood.id ? 'selected' : ''}`}
              style={{
                background: selected?.id === mood.id ? `${mood.color.replace('hsl(', 'hsla(').replace(')', ', 0.15)')}` : 'hsl(240, 18%, 9%)',
                borderColor: selected?.id === mood.id ? mood.color : 'hsl(240, 15%, 18%)',
              }}
            >
              <span style={{ fontSize: '28px' }}>{mood.emoji}</span>
              <span className="text-xs font-body" style={{ color: 'hsl(45, 20%, 80%)' }}>{mood.label}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="animate-fade-in rounded-3xl p-6 border" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}>
            <div className="flex items-center gap-3 mb-6">
              <span style={{ fontSize: '32px' }}>{selected.emoji}</span>
              <div>
                <h3 className="font-display text-2xl" style={{ color: 'hsl(45, 30%, 90%)' }}>{selected.label}</h3>
                <p className="text-sm font-body" style={{ color: 'hsl(240, 10%, 55%)' }}>{selected.desc}</p>
              </div>
              <div className="ml-auto">
                <MusicBars playing={playingTrack !== null} color={selected.color} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {selected.tracks.map((track, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200"
                  style={{
                    background: playingTrack === idx ? `${selected.color}15` : 'hsl(240, 20%, 7%)',
                    borderColor: playingTrack === idx ? selected.color : 'hsl(240, 15%, 15%)',
                  }}
                  onClick={() => setPlayingTrack(playingTrack === idx ? null : idx)}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${selected.color}20` }}>
                    {playingTrack === idx
                      ? <Icon name="Pause" size={16} style={{ color: selected.color }} />
                      : <Icon name="Play" size={16} style={{ color: selected.color }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-sm truncate" style={{ color: 'hsl(45, 20%, 85%)' }}>{track.title}</p>
                    <p className="text-xs truncate font-body" style={{ color: 'hsl(240, 10%, 50%)' }}>{track.composer} · {track.genre}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-body" style={{ color: 'hsl(240, 10%, 50%)' }}>{track.duration}</p>
                    <p className="text-xs font-body" style={{ color: selected.color }}>{track.freq}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Section: Exercises ───────────────────────────────────────────────────────

function ExercisesSection() {
  const [activeEx, setActiveEx] = useState<Exercise | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voice = useVoiceAnalyzer();

  const startEx = (ex: Exercise) => {
    setActiveEx(ex);
    setTimeLeft(ex.duration);
    setStep(0);
    setRunning(false);
    voice.stop();
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

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20" style={{ background: 'hsl(240, 22%, 5%)' }}>
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 font-body" style={{ color: 'hsl(270, 50%, 65%)' }}>
            Вокальная реабилитация
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
                    <Icon name={ex.icon as 'Wind' | 'Mic' | 'MessageCircle' | 'Radio'} size={22} style={{ color: ex.color }} />
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
          <div className="animate-fade-in">
            <button
              onClick={() => { setActiveEx(null); setRunning(false); voice.stop(); if (intervalRef.current) clearInterval(intervalRef.current); }}
              className="flex items-center gap-2 mb-6 text-sm font-body transition-opacity hover:opacity-70"
              style={{ color: 'hsl(240, 10%, 55%)' }}
            >
              <Icon name="ChevronLeft" size={16} />
              Все упражнения
            </button>

            <div className="rounded-3xl border p-8" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${activeEx.color}20` }}>
                  <Icon name={activeEx.icon as 'Wind' | 'Mic' | 'MessageCircle' | 'Radio'} size={26} style={{ color: activeEx.color }} />
                </div>
                <div>
                  <h3 className="font-display text-3xl font-light" style={{ color: 'hsl(45, 30%, 90%)' }}>{activeEx.title}</h3>
                  <p className="font-body text-sm" style={{ color: 'hsl(240, 10%, 55%)' }}>{activeEx.subtitle}</p>
                </div>
              </div>

              <div className="flex justify-center mb-8">
                <div className="relative">
                  <svg width="160" height="160" className="-rotate-90">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(240, 15%, 15%)" strokeWidth="6" />
                    <circle
                      cx="80" cy="80" r="70" fill="none"
                      stroke={activeEx.color} strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-4xl" style={{ color: 'hsl(45, 30%, 90%)' }}>{fmt(timeLeft)}</span>
                    <span className="text-xs font-body" style={{ color: 'hsl(240, 10%, 50%)' }}>осталось</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <WaveformVisualizer analyser={voice.analyser} isActive={voice.isListening} />
              </div>

              {voice.isListening && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <VUMeter value={voice.volume} max={120} label="Громкость" color="hsl(175, 55%, 45%)" />
                  <VUMeter value={voice.pitch > 1000 ? 0 : voice.pitch} max={500} label="Частота (Гц)" color="hsl(270, 50%, 65%)" />
                </div>
              )}

              {voice.warning && (
                <div className="mb-6 p-3 rounded-xl flex items-center gap-2" style={{ background: 'hsl(30, 80%, 40%, 0.2)', border: '1px solid hsl(30, 80%, 40%, 0.4)' }}>
                  <Icon name="AlertTriangle" size={16} style={{ color: 'hsl(35, 80%, 60%)' }} />
                  <span className="text-sm font-body" style={{ color: 'hsl(35, 80%, 70%)' }}>{voice.warning}</span>
                </div>
              )}

              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase mb-3 font-body" style={{ color: 'hsl(240, 10%, 45%)' }}>Техника</p>
                <div className="flex flex-col gap-2">
                  {activeEx.steps.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                      style={{ background: step === i ? `${activeEx.color}15` : 'transparent' }}
                      onClick={() => setStep(i)}
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

              <button
                onClick={toggleTimer}
                className="w-full py-4 rounded-2xl font-body font-medium text-base transition-all duration-200 hover:opacity-90"
                style={{
                  background: running ? 'hsl(240, 15%, 20%)' : activeEx.color,
                  color: running ? 'hsl(45, 20%, 80%)' : 'hsl(240, 20%, 6%)',
                }}
              >
                {running ? '⏸ Пауза' : timeLeft === 0 ? '↺ Начать снова' : '▶ Начать'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Section: Diary ───────────────────────────────────────────────────────────

function DiarySection() {
  const [entries, setEntries] = useState<DiaryEntry[]>([
    { id: '1', date: '9 апр', mood: 'Спокойствие', moodEmoji: '🌊', exercise: 'Диафрагмальное дыхание', duration: 3, avgDb: 45, note: 'Хорошее ощущение от упражнения' },
    { id: '2', date: '8 апр', mood: 'Фокус', moodEmoji: '🎯', exercise: 'Артикуляция', duration: 2, avgDb: 52, note: 'Дикция становится чище' },
    { id: '3', date: '7 апр', mood: 'Энергия', moodEmoji: '⚡', exercise: 'Распевка связок', duration: 4, avgDb: 68, note: 'Голос звучит ярче' },
    { id: '4', date: '6 апр', mood: 'Грусть', moodEmoji: '🌧', exercise: 'Резонанс и проекция', duration: 3, avgDb: 38, note: 'Сложно с проекцией' },
    { id: '5', date: '5 апр', mood: 'Спокойствие', moodEmoji: '🌊', exercise: 'Диафрагмальное дыхание', duration: 2, avgDb: 42, note: '' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [note, setNote] = useState('');

  const totalMin = entries.reduce((s, e) => s + e.duration, 0);
  const avgDbAll = Math.round(entries.reduce((s, e) => s + e.avgDb, 0) / entries.length);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 font-body" style={{ color: 'hsl(175, 55%, 45%)' }}>
            Дневник
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light mb-4" style={{ color: 'hsl(45, 30%, 90%)' }}>
            Ваш прогресс
          </h2>
          <p className="font-body text-base" style={{ color: 'hsl(240, 10%, 55%)' }}>
            История сессий и динамика развития голоса
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Минут занятий', value: String(totalMin), icon: 'Clock', color: 'hsl(175, 55%, 45%)' },
            { label: 'Средний уровень', value: `${avgDbAll} дБ`, icon: 'Volume2', color: 'hsl(45, 70%, 65%)' },
            { label: 'Дней подряд', value: String(entries.length), icon: 'Flame', color: 'hsl(270, 50%, 65%)' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl border p-5 text-center" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}>
              <Icon name={stat.icon as 'Clock' | 'Volume2' | 'Flame'} size={20} className="mx-auto mb-2" style={{ color: stat.color }} />
              <div className="font-display text-3xl font-light mb-1" style={{ color: 'hsl(45, 30%, 90%)' }}>{stat.value}</div>
              <div className="text-xs font-body" style={{ color: 'hsl(240, 10%, 50%)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border p-6 mb-6" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}>
          <p className="text-xs tracking-widest uppercase mb-4 font-body" style={{ color: 'hsl(240, 10%, 45%)' }}>Громкость по дням</p>
          <div className="flex items-end gap-2" style={{ height: '80px' }}>
            {[...entries].reverse().map((e, i) => (
              <div key={e.id} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${(e.avgDb / 80) * 100}%`,
                    minHeight: '4px',
                    background: `hsl(${45 + i * 30}, 65%, ${50 + i * 3}%)`,
                    opacity: 0.8,
                  }}
                />
                <span className="text-[9px] font-body" style={{ color: 'hsl(240, 10%, 40%)' }}>{e.date.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-2xl border p-5" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '20px' }}>{entry.moodEmoji}</span>
                  <div>
                    <span className="font-body font-medium text-sm" style={{ color: 'hsl(45, 20%, 85%)' }}>{entry.mood}</span>
                    <span className="text-xs font-body ml-2" style={{ color: 'hsl(240, 10%, 45%)' }}>· {entry.exercise}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-body" style={{ color: 'hsl(240, 10%, 40%)' }}>{entry.date}</p>
                  <p className="text-xs font-body" style={{ color: 'hsl(175, 55%, 45%)' }}>{entry.duration} мин · {entry.avgDb} дБ</p>
                </div>
              </div>
              {entry.note && (
                <p className="text-xs font-body leading-relaxed italic" style={{ color: 'hsl(240, 10%, 50%)' }}>"{entry.note}"</p>
              )}
            </div>
          ))}
        </div>

        {!showAdd ? (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-4 rounded-2xl border font-body font-medium text-sm transition-all hover:opacity-80"
            style={{ borderColor: 'hsl(240, 15%, 25%)', color: 'hsl(240, 10%, 55%)', background: 'transparent' }}
          >
            + Добавить запись
          </button>
        ) : (
          <div className="animate-fade-in rounded-2xl border p-5" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 25%)' }}>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Заметки о сессии..."
              className="w-full bg-transparent font-body text-sm resize-none outline-none mb-4"
              style={{ color: 'hsl(45, 20%, 80%)', minHeight: '80px' }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const now = new Date();
                  const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
                  setEntries(prev => [{
                    id: Date.now().toString(),
                    date: `${now.getDate()} ${months[now.getMonth()]}`,
                    mood: 'Спокойствие', moodEmoji: '🌊',
                    exercise: 'Свободная практика',
                    duration: 5, avgDb: 50, note,
                  }, ...prev]);
                  setNote(''); setShowAdd(false);
                }}
                className="flex-1 py-3 rounded-xl font-body text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: 'hsl(175, 55%, 45%)', color: 'hsl(240, 20%, 6%)' }}
              >
                Сохранить
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-6 py-3 rounded-xl font-body text-sm transition-opacity hover:opacity-70"
                style={{ background: 'hsl(240, 15%, 15%)', color: 'hsl(240, 10%, 55%)' }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Section: Profile ─────────────────────────────────────────────────────────

function ProfileSection() {
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

// ─── Onboarding ──────────────────────────────────────────────────────────────

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
    title: 'Вокальная реабилитация',
    desc: 'Дыхательные упражнения на диафрагму и контроль выдоха, распевки для связок и артикуляция — шаг за шагом с инструкцией и таймером.',
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
        <div className="mb-12 flex items-center gap-2 opacity-60">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(270,50%,40%), hsl(45,70%,55%))' }}>
            <span style={{ fontSize: '11px' }}>♪</span>
          </div>
          <span className="font-display text-sm tracking-widest shimmer-text">Резонанс</span>
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
    <div className="min-h-screen" style={{ background: 'hsl(240, 20%, 6%)' }}>
      {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'hsl(240, 20%, 6%, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid hsl(240, 15%, 14%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(270,50%,40%), hsl(45,70%,55%))' }}>
            <span style={{ fontSize: '14px' }}>♪</span>
          </div>
          <span className="font-display text-xl tracking-wide shimmer-text">Резонанс</span>
        </div>
        <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl" style={{ background: 'hsl(240, 18%, 10%)' }}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-body transition-all duration-200"
              style={{
                background: active === s.id ? 'hsl(240, 15%, 20%)' : 'transparent',
                color: active === s.id ? 'hsl(45, 30%, 90%)' : 'hsl(240, 10%, 50%)',
              }}
            >
              <Icon name={s.icon} size={14} />
              {s.label}
            </button>
          ))}
        </div>
      </header>

      <main className="pt-16">
        {active === 'mood' && <MoodSection />}
        {active === 'exercises' && <ExercisesSection />}
        {active === 'diary' && <DiarySection />}
        {active === 'profile' && <ProfileSection />}
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
        style={{ background: 'hsl(240, 20%, 7%, 0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid hsl(240, 15%, 14%)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className="flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200"
          >
            <Icon
              name={s.icon}
              size={20}
              style={{ color: active === s.id ? 'hsl(45, 70%, 65%)' : 'hsl(240, 10%, 40%)' }}
            />
            <span className="text-[10px] font-body" style={{ color: active === s.id ? 'hsl(45, 70%, 65%)' : 'hsl(240, 10%, 40%)' }}>
              {s.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}