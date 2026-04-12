import { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';

type Exercise = {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  icon: string;
  steps: string[];
  color: string;
  warning?: string;
  subExercises?: { name: string; desc: string }[];
  forbidden?: string[];
  regime?: string;
};

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
    title: 'Разогрев голосовых складок',
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
      'Штробас: расслабьте гортань, на выдохе издайте самый низкий возможный треск/клокотание («крякающий» звук) — без усилий, 10–15 секунд. Это мягко размыкает складки и снимает утреннюю зажатость',
    ]
  },
  {
    id: 'articulation',
    title: 'Артикуляция',
    subtitle: 'Чёткость и дикция',
    duration: 300,
    icon: 'MessageCircle',
    color: 'hsl(45, 70%, 65%)',
    steps: [
      'Широко открывайте рот на каждый гласный — разогрев губ и челюсти',
      'Вытягивание губ «у» — растягивание «и» — 20 повторений',
      'Жевательные движения с включённым звуком «ммм»',
      'Чёткое произношение согласных: т, д, н, л — по 10 раз каждый',
      '— «Карл у Клары украл кораллы, а Клара у Карла украла кларнет»',
      '— «Шла Саша по шоссе и сосала сушку»',
      '— «Тридцать три корабля лавировали, лавировали, да не вылавировали»',
      '— «Протокол про протокол протоколом запротоколировали»',
      '— «Расскажите про покупки. Про какие про покупки? Про покупки, про покупки, про покупочки свои»',
      '— «Сшит колпак не по-колпаковски — надо колпак переколпаковать»',
      '— «Бык тупогуб, тупогубенький бычок, у быка бела губа была тупа»',
      '— «Щетина у чушки, чешуя у щучки»',
      '— «Король орёл, орёл король»',
      '— «Дробью по перепелам да по тетеревам»',
      'Каждую скороговорку: сначала медленно по слогам, затем в рабочем темпе',
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
      'Глиссандо на «А»: скользите голосом снизу вверх и обратно, как сирена — плавно, без остановок',
      'Слоговая распевка: «ми-мэ-ма-мо-му» — пропойте по полутонам вверх и вниз, удерживая каждый звук',
      'Гудение (мычание): закрытым ртом мычите простую мелодию, ощущая вибрацию в скулах, лбу и губах',
    ]
  },
  {
    id: 'rehab',
    title: 'Реабилитация голоса',
    subtitle: 'Комплекс «Мягкий шаг»',
    duration: 300,
    icon: 'HeartPulse',
    color: 'hsl(340, 60%, 55%)',
    warning: 'Перед началом ОБЯЗАТЕЛЬНО спросите у врача или фониатра, можно ли вам сейчас нагружать складки. Никакой боли, дискомфорта и шёпота — шёпот вреднее крика.',
    steps: [
      'Прочитайте описание каждого упражнения ниже',
      'Выполняйте строго в указанном порядке',
      'При малейшей боли или охриплости — остановитесь',
      'Режим: 3–5 минут утром, 3–5 минут вечером',
      'Если осипли или устали — день отдыха',
    ],
    subExercises: [
      {
        name: '1. «Согрей ладошки» — дыхание',
        desc: 'Сядьте ровно. Вдох носом (живот надулся), выдох ртом — медленно, будто греете замёрзшие руки, губы трубочкой. Выдох длиннее вдоха. 5 повторений. Снимает спазм гортани при стрессе.',
      },
      {
        name: '2. «Зевающее мычание» — снятие стрессового зажима',
        desc: 'Откройте рот как для зевка. На спокойном выдохе помычите «Мммммм» с закрытым ртом. Губы сомкнуты, челюсть расслаблена. Чувствуете вибрацию в груди? Это возвращает голос без крика.',
      },
      {
        name: '3. «Трубочка — улыбка» — после инсульта',
        desc: 'Вытяните губы трубочкой (без звука), затем широко улыбнитесь. 5–6 раз. Потом добавьте на выдохе: «Ууууу» (трубочка) → «Иииии» (улыбка). Оживляет артикуляцию.',
      },
      {
        name: '4. «Скользящая свечка» — после операции на щитовидной железе',
        desc: '«Свечка близко» — тихо и долго: «Ффффф». «Свечка далеко» — сильнее и короче: «Фф!». «Три свечки» — прерывисто: «Фф! Фф! Фф!». Мягко тренирует смыкание складок без крика.',
      },
      {
        name: '5. «Струна и бархат» — после операций на складках',
        desc: 'Только через месяц после снятия швов, с разрешения врача. Гласная «А» или «О» — сначала тонким высоким голосом (2 сек), затем тем же выдохом — низким грудным (2 сек). Без усилий.',
      },
      {
        name: '6. «Капельки» — после длительного ларингита',
        desc: 'Постучите кончиками пальцев по скулам, лбу, шее (легко). Затем на выдохе: «Хмммм… Хнннн… Хмммм…» — еле слышно, как детское бормотание. Убирает остаточную сухость и спазм.',
      },
    ],
    forbidden: [
      'Шептать — это как кричать связанными шнурками',
      'Кашлять с силой — лучше тихонько «кх-кх» с закрытым ртом',
      'Пить ледяное или очень горячее',
      'Проверять голос пением вне занятий',
    ],
    regime: 'Голос любит не тренировки, а спокойное и сытое тело: влажность 60%, тёплая вода, сон.',
  },
  {
    id: 'organs',
    title: 'Воздействие на органы',
    subtitle: 'Музыкотерапевтические упражнения',
    duration: 360,
    icon: 'Stethoscope',
    color: 'hsl(155, 50%, 45%)',
    warning: 'Не заменяйте лечение! При реальных заболеваниях органов эти упражнения — только дополнение к врачебной помощи.',
    steps: [
      'Начинайте с 2–3 минут на одну зону, не форсируя громкость',
      'Лучший эффект — с закрытыми глазами, лёжа или сидя с прямой спиной',
      'Делайте паузы между зонами, «прислушиваясь» к отклику тела',
      'Звук должен быть тихим и ровным — без напряжения',
      'Переходите к следующей зоне только после ощущения вибрации в текущей',
    ],
    subExercises: [
      {
        name: '❤️ Сердце и сосуды — звук «О» или «А»',
        desc: 'Тихое, ровное пение гласной «О» или «А» с вибрацией в груди. Положите ладонь на сердце, представляя, как звук обволакивает его. Ритм — ларго (60–70 ударов в минуту). Музыка: флейта, арфа, спокойная инструментальная.',
      },
      {
        name: '🫁 Лёгкие и бронхи — звук «С» или «Ш»',
        desc: 'Длительное пение на выдохе звука «С» или шипящего «Ш» (как спуск колеса). Затем сонорный «М» с закрытым ртом, направляя вибрацию в грудную клетку. Стимулирует выдох, помогает при кашле, снимает спазм.',
      },
      {
        name: '🫀 Желудок, кишечник, печень — звук «У»',
        desc: 'Пропевание звука «У» (низкий, глубокий) на одной ноте. Ладонь на солнечном сплетении или правом подреберье. Делайте паузы, чтобы «услышать» отклик. Музыка: виолончель, низкий мужской голос, барабан-шейкер.',
      },
      {
        name: '🫘 Почки и поясница — звук «Э»',
        desc: 'Пение звука «Э» (как в слове «эхо») с небольшим наклоном корпуса вперёд. Руки на пояснице. Вибрация должна ощущаться сзади. Плавное глиссандо снизу вверх — скольжение голосом.',
      },
      {
        name: '🧠 Голова и лобные пазухи — звук «М»',
        desc: 'Гудение с закрытым ртом «М-М-М» (как пчела), направляя вибрацию в область лба и носа. Губы сомкнуты, зубы разомкнуты. При гайморите или мигрени — только если нет боли.',
      },
      {
        name: '✨ «Сканирование тела» — общее расслабление',
        desc: 'Лёжа, издавайте долгий звук «А-А-А-А» на одном дыхании, мысленно освещая звуком орган за органом — от стоп до макушки. Через 3–5 минут смените звук на «О-О-О».',
      },
    ],
    regime: 'Лучшее время — утром до еды или вечером перед сном. Курс: 10–14 дней подряд по 10–15 минут.',
  },
];

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
                  <Icon name={activeEx.icon as 'Wind' | 'Mic' | 'MessageCircle' | 'Radio' | 'HeartPulse' | 'Stethoscope'} size={26} style={{ color: activeEx.color }} />
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

              {activeEx.warning && (
                <div className="mb-6 p-4 rounded-2xl flex items-start gap-3" style={{ background: 'hsl(340, 60%, 15%, 0.5)', border: '1px solid hsl(340, 60%, 35%, 0.5)' }}>
                  <Icon name="ShieldAlert" size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'hsl(340, 60%, 65%)' }} />
                  <p className="text-sm font-body leading-relaxed" style={{ color: 'hsl(340, 40%, 75%)' }}>{activeEx.warning}</p>
                </div>
              )}

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

              {activeEx.regime && (
                <div className="mb-6 p-4 rounded-2xl flex items-start gap-3" style={{ background: `${activeEx.color}10`, border: `1px solid ${activeEx.color}25` }}>
                  <Icon name="Leaf" size={16} className="flex-shrink-0 mt-0.5" style={{ color: activeEx.color }} />
                  <p className="text-sm font-body leading-relaxed" style={{ color: 'hsl(240, 10%, 60%)' }}>{activeEx.regime}</p>
                </div>
              )}

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
