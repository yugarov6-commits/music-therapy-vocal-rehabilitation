import { useState } from 'react';
import Icon from '@/components/ui/icon';

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

export default function DiarySection() {
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
                    id: String(Date.now()),
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
