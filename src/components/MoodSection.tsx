import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '@/func2url.json';

const TRACKS_URL = func2url.tracks;

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
  ytSearch: string;
};

type UploadedTrack = { key: string; name: string; url: string; size: number };

const MOODS: Mood[] = [
  {
    id: 'calm',
    emoji: '🌊',
    label: 'Спокойствие',
    color: 'hsl(175, 55%, 45%)',
    desc: 'Умиротворение и тишина',
    tracks: [
      { title: 'Gymnopédie No.1', composer: 'Эрик Сати', genre: 'Неоклассика', duration: '3:04', freq: '432 Гц', ytSearch: 'Erik Satie Gymnopedie No 1 piano' },
      { title: 'Clair de Lune', composer: 'Клод Дебюсси', genre: 'Классика', duration: '5:12', freq: '432 Гц', ytSearch: 'Debussy Clair de Lune piano' },
      { title: 'Experience', composer: 'Людовико Эйнауди', genre: 'Неоклассика', duration: '5:13', freq: '432 Гц', ytSearch: 'Ludovico Einaudi Experience piano' },
      { title: 'Watermark', composer: 'Энья', genre: 'Эмбиент', duration: '2:25', freq: '432 Гц', ytSearch: 'Enya Watermark instrumental' },
      { title: 'Reflecting Light', composer: 'Сэм Ли', genre: 'Фолк', duration: '4:10', freq: '432 Гц', ytSearch: 'Sam Lee Reflecting Light folk' },
      { title: 'Comptine No.2 — Tiersen', composer: 'Янн Тирсен', genre: 'Кино', duration: '2:47', freq: '432 Гц', ytSearch: 'Yann Tiersen Comptine No 2 piano' },
      { title: 'Opus 36', composer: 'Нильс Фрам', genre: 'Неоклассика', duration: '5:58', freq: '432 Гц', ytSearch: 'Nils Frahm Opus 36 piano' },
    ]
  },
  {
    id: 'anxious',
    emoji: '🌀',
    label: 'Тревога',
    color: 'hsl(270, 50%, 55%)',
    desc: 'Успокоить бурю внутри',
    tracks: [
      { title: 'Spiegel im Spiegel', composer: 'Арво Пярт', genre: 'Минимализм', duration: '10:10', freq: '432 Гц', ytSearch: 'Arvo Part Spiegel im Spiegel piano violin' },
      { title: 'Weightless', composer: 'Marconi Union', genre: 'Эмбиент', duration: '8:09', freq: '60 BPM', ytSearch: 'Marconi Union Weightless ambient' },
      { title: 'Opus 23', composer: 'Нильс Фрам', genre: 'Неоклассика', duration: '4:48', freq: '432 Гц', ytSearch: 'Nils Frahm Opus 23 piano' },
      { title: 'Longing', composer: 'Arvo Pärt', genre: 'Минимализм', duration: '6:30', freq: '432 Гц', ytSearch: 'Arvo Part Für Alina piano' },
      { title: 'Holocene', composer: 'Bon Iver', genre: 'Инди', duration: '5:37', freq: '432 Гц', ytSearch: 'Bon Iver Holocene piano cover' },
      { title: 'The Blue Notebooks', composer: 'Макс Рихтер', genre: 'Неоклассика', duration: '7:12', freq: '432 Гц', ytSearch: 'Max Richter The Blue Notebooks piano' },
      { title: 'Slow Meadow', composer: 'Slow Meadow', genre: 'Эмбиент', duration: '5:44', freq: '432 Гц', ytSearch: 'Slow Meadow ambient piano' },
    ]
  },
  {
    id: 'sad',
    emoji: '🌧',
    label: 'Грусть',
    color: 'hsl(210, 50%, 50%)',
    desc: 'Принять и отпустить',
    tracks: [
      { title: 'Adagio for Strings', composer: 'Сэмюэл Барбер', genre: 'Классика', duration: '9:32', freq: '432 Гц', ytSearch: 'Barber Adagio for Strings orchestra' },
      { title: 'River Flows in You', composer: 'Юндзи Ли', genre: 'Неоклассика', duration: '3:45', freq: '432 Гц', ytSearch: 'Yiruma River Flows in You piano' },
      { title: "Comptine d'un autre été", composer: 'Янн Тирсен', genre: 'Кино', duration: '2:31', freq: '432 Гц', ytSearch: 'Yann Tiersen Comptine piano Amelie' },
      { title: 'Lacrimosa (Requiem)', composer: 'Моцарт', genre: 'Классика', duration: '3:41', freq: '432 Гц', ytSearch: 'Mozart Lacrimosa Requiem choir orchestra' },
      { title: 'The Rain', composer: 'Юундзи Ли', genre: 'Неоклассика', duration: '2:58', freq: '432 Гц', ytSearch: 'Yiruma The Rain piano' },
      { title: 'Elegy for the Arctic', composer: 'Людовико Эйнауди', genre: 'Неоклассика', duration: '4:17', freq: '432 Гц', ytSearch: 'Ludovico Einaudi Elegy for the Arctic piano' },
      { title: 'Fragile', composer: 'Стинг', genre: 'Поп-баллада', duration: '4:02', freq: '432 Гц', ytSearch: 'Sting Fragile piano version' },
    ]
  },
  {
    id: 'energetic',
    emoji: '⚡',
    label: 'Энергия',
    color: 'hsl(45, 70%, 65%)',
    desc: 'Подъём и вдохновение',
    tracks: [
      { title: 'The Four Seasons: Spring', composer: 'Вивальди', genre: 'Барокко', duration: '11:02', freq: '440 Гц', ytSearch: 'Vivaldi Four Seasons Spring orchestra' },
      { title: 'Symphony No.5 — I', composer: 'Бетховен', genre: 'Классика', duration: '7:22', freq: '440 Гц', ytSearch: 'Beethoven Symphony 5 orchestra' },
      { title: 'Divenire', composer: 'Людовико Эйнауди', genre: 'Неоклассика', duration: '6:40', freq: '440 Гц', ytSearch: 'Ludovico Einaudi Divenire piano orchestra' },
      { title: 'Hungarian Dance No.5', composer: 'Брамс', genre: 'Классика', duration: '2:50', freq: '440 Гц', ytSearch: 'Brahms Hungarian Dance No 5 orchestra' },
      { title: 'Flight of the Bumblebee', composer: 'Римский-Корсаков', genre: 'Классика', duration: '1:40', freq: '440 Гц', ytSearch: 'Rimsky-Korsakov Flight of the Bumblebee orchestra' },
      { title: 'Ride of the Valkyries', composer: 'Вагнер', genre: 'Симфония', duration: '5:43', freq: '440 Гц', ytSearch: 'Wagner Ride of the Valkyries orchestra' },
      { title: 'Chariots of Fire', composer: 'Вангелис', genre: 'Кино', duration: '3:25', freq: '440 Гц', ytSearch: 'Vangelis Chariots of Fire piano' },
    ]
  },
  {
    id: 'focused',
    emoji: '🎯',
    label: 'Фокус',
    color: 'hsl(245, 55%, 60%)',
    desc: 'Ясность и концентрация',
    tracks: [
      { title: 'Cello Suite No.1 Prelude', composer: 'И.С. Бах', genre: 'Барокко', duration: '2:20', freq: '432 Гц', ytSearch: 'Bach Cello Suite No 1 Prelude' },
      { title: 'Metamorphosis Two', composer: 'Филип Гласс', genre: 'Минимализм', duration: '5:31', freq: '432 Гц', ytSearch: 'Philip Glass Metamorphosis Two piano' },
      { title: 'On the Nature of Daylight', composer: 'Макс Рихтер', genre: 'Неоклассика', duration: '7:01', freq: '432 Гц', ytSearch: 'Max Richter On the Nature of Daylight' },
      { title: 'Goldberg Variations: Aria', composer: 'И.С. Бах', genre: 'Барокко', duration: '4:12', freq: '432 Гц', ytSearch: 'Bach Goldberg Variations Aria Glenn Gould' },
      { title: 'Études, Op.10 No.3', composer: 'Шопен', genre: 'Классика', duration: '4:17', freq: '432 Гц', ytSearch: 'Chopin Etude Op 10 No 3 Tristesse piano' },
      { title: 'Music for Airports 1/1', composer: 'Брайан Ино', genre: 'Эмбиент', duration: '17:10', freq: '432 Гц', ytSearch: 'Brian Eno Music for Airports 1 ambient' },
      { title: 'Gymnopédie No.2', composer: 'Эрик Сати', genre: 'Неоклассика', duration: '3:27', freq: '432 Гц', ytSearch: 'Erik Satie Gymnopedie No 2 piano' },
    ]
  },
  {
    id: 'joyful',
    emoji: '✨',
    label: 'Радость',
    color: 'hsl(35, 80%, 60%)',
    desc: 'Лёгкость и свет',
    tracks: [
      { title: 'Piano Concerto No.21 Andante', composer: 'Моцарт', genre: 'Классика', duration: '6:15', freq: '440 Гц', ytSearch: 'Mozart Piano Concerto 21 Andante' },
      { title: "La Valse d'Amélie", composer: 'Янн Тирсен', genre: 'Кино', duration: '3:07', freq: '440 Гц', ytSearch: 'Yann Tiersen La Valse Amelie piano' },
      { title: 'I Giorni', composer: 'Людовико Эйнауди', genre: 'Неоклассика', duration: '5:37', freq: '440 Гц', ytSearch: 'Ludovico Einaudi I Giorni piano' },
      { title: 'Eine Kleine Nachtmusik', composer: 'Моцарт', genre: 'Классика', duration: '6:24', freq: '440 Гц', ytSearch: 'Mozart Eine Kleine Nachtmusik orchestra' },
      { title: 'Spring Waltz', composer: 'Юундзи Ли', genre: 'Неоклассика', duration: '2:56', freq: '440 Гц', ytSearch: 'Yiruma Spring Waltz piano' },
      { title: 'The Four Seasons: Summer', composer: 'Вивальди', genre: 'Барокко', duration: '10:14', freq: '440 Гц', ytSearch: 'Vivaldi Four Seasons Summer orchestra' },
      { title: 'La Primavera', composer: 'Людовико Эйнауди', genre: 'Неоклассика', duration: '3:47', freq: '440 Гц', ytSearch: 'Ludovico Einaudi La Primavera piano' },
    ]
  },
  {
    id: 'fear',
    emoji: '😨',
    label: 'Страх',
    color: 'hsl(195, 60%, 45%)',
    desc: 'Обрести почву под ногами',
    tracks: [
      { title: 'Nimrod (Enigma Variations)', composer: 'Эдвард Элгар', genre: 'Классика', duration: '3:30', freq: '432 Гц', ytSearch: 'Elgar Nimrod Enigma Variations orchestra' },
      { title: 'Lux Aeterna', composer: 'Мортон Лауридсен', genre: 'Хоровая', duration: '7:20', freq: '432 Гц', ytSearch: 'Morten Lauridsen Lux Aeterna choral' },
      { title: 'Sanctuary', composer: 'Арво Пярт', genre: 'Минимализм', duration: '5:04', freq: '432 Гц', ytSearch: 'Arvo Part Salve Regina choral' },
      { title: 'Cello Concerto — Adagio', composer: 'Дворжак', genre: 'Классика', duration: '13:20', freq: '432 Гц', ytSearch: 'Dvorak Cello Concerto Adagio orchestra' },
      { title: 'Pie Jesu (Requiem)', composer: 'Габриэль Форе', genre: 'Хоровая', duration: '3:40', freq: '432 Гц', ytSearch: 'Faure Requiem Pie Jesu soprano choir' },
      { title: 'Island Prelude', composer: 'Нильс Фрам', genre: 'Неоклассика', duration: '4:33', freq: '432 Гц', ytSearch: 'Nils Frahm Says piano' },
      { title: 'O magnum mysterium', composer: 'Мортон Лауридсен', genre: 'Хоровая', duration: '4:50', freq: '432 Гц', ytSearch: 'Morten Lauridsen O magnum mysterium choir' },
    ]
  },
  {
    id: 'tired',
    emoji: '😮‍💨',
    label: 'Усталость',
    color: 'hsl(220, 35%, 55%)',
    desc: 'Мягкое восстановление сил',
    tracks: [
      { title: 'Gymnopédie No.3', composer: 'Эрик Сати', genre: 'Неоклассика', duration: '3:14', freq: '432 Гц', ytSearch: 'Erik Satie Gymnopedie No 3 piano' },
      { title: 'Sleep', composer: 'Макс Рихтер', genre: 'Эмбиент', duration: '8:24', freq: '432 Гц', ytSearch: 'Max Richter Sleep piano' },
      { title: 'Nuvole Bianche', composer: 'Людовико Эйнауди', genre: 'Неоклассика', duration: '5:55', freq: '432 Гц', ytSearch: 'Ludovico Einaudi Nuvole Bianche piano' },
      { title: 'Raindrop Prelude Op.28', composer: 'Шопен', genre: 'Классика', duration: '5:04', freq: '432 Гц', ytSearch: 'Chopin Raindrop Prelude Op 28 No 15 piano' },
      { title: 'Nocturne in E-flat', composer: 'Шопен', genre: 'Классика', duration: '4:31', freq: '432 Гц', ytSearch: 'Chopin Nocturne E flat major Op 9 No 2 piano' },
      { title: 'Deep Sleep Music', composer: 'Нильс Фрам', genre: 'Эмбиент', duration: '9:11', freq: '432 Гц', ytSearch: 'Nils Frahm All Melody ambient piano' },
      { title: 'Evening Song', composer: 'Эдвард Григ', genre: 'Классика', duration: '3:52', freq: '432 Гц', ytSearch: 'Grieg Lyric Pieces Evening in the Mountains piano' },
    ]
  },
  {
    id: 'anger',
    emoji: '🔥',
    label: 'Гнев',
    color: 'hsl(10, 75%, 52%)',
    desc: 'Выразить и отпустить',
    tracks: [
      { title: 'Mars (The Planets)', composer: 'Густав Холст', genre: 'Симфония', duration: '7:30', freq: '440 Гц', ytSearch: 'Holst The Planets Mars Bringer of War orchestra' },
      { title: 'Toccata and Fugue in D minor', composer: 'И.С. Бах', genre: 'Орган', duration: '9:10', freq: '440 Гц', ytSearch: 'Bach Toccata Fugue D minor organ' },
      { title: 'Dies Irae (Requiem)', composer: 'Верди', genre: 'Хоровая', duration: '4:05', freq: '440 Гц', ytSearch: 'Verdi Requiem Dies Irae orchestra choir' },
      { title: 'Symphony No.9 — IV', composer: 'Бетховен', genre: 'Симфония', duration: '24:00', freq: '440 Гц', ytSearch: 'Beethoven Symphony 9 fourth movement Ode to Joy' },
      { title: 'Rite of Spring — Opening', composer: 'Стравинский', genre: 'Балет', duration: '3:30', freq: '440 Гц', ytSearch: 'Stravinsky Rite of Spring opening orchestra' },
      { title: 'O Fortuna (Carmina Burana)', composer: 'Карл Орф', genre: 'Хоровая', duration: '2:35', freq: '440 Гц', ytSearch: 'Carl Orff O Fortuna Carmina Burana choir orchestra' },
      { title: 'Overture 1812', composer: 'Чайковский', genre: 'Симфония', duration: '15:00', freq: '440 Гц', ytSearch: 'Tchaikovsky 1812 Overture orchestra cannon' },
    ]
  },
];

function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb animate-orb" style={{ width: '500px', height: '500px', top: '-10%', left: '-8%', background: 'hsl(270,55%,28%,0.4)' }} />
      <div className="orb animate-orb" style={{ width: '400px', height: '400px', bottom: '-5%', right: '-5%', background: 'hsl(200,60%,22%,0.35)', animationDelay: '4s' }} />
      <div className="orb" style={{ width: '300px', height: '300px', top: '40%', left: '55%', background: 'hsl(330,55%,20%,0.25)' }} />

      <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '45%' }}>
        <defs>
          <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(270,55%,18%)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="hsl(330,50%,18%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(200,55%,15%)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(245,55%,20%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(270,45%,15%)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path className="animate-wave" d="M0,140 C180,190 360,90 540,130 C720,170 900,70 1080,110 C1260,150 1380,190 1440,165 L1440,320 L0,320 Z" fill="url(#wg1)" />
        <path className="animate-wave-2" d="M0,190 C200,150 400,230 600,190 C800,150 1000,230 1200,195 C1320,175 1400,205 1440,215 L1440,320 L0,320 Z" fill="url(#wg2)" />
        <path d="M0,245 C300,215 600,265 900,245 C1100,235 1300,255 1440,250 L1440,320 L0,320 Z" fill="hsl(235,25%,8%,0.6)" />
      </svg>

      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="animate-float absolute rounded-full"
          style={{
            width: `${2 + (i % 4) * 2}px`,
            height: `${2 + (i % 4) * 2}px`,
            left: `${5 + i * 8}%`,
            top: `${15 + (i % 5) * 14}%`,
            background: [
              'hsl(45,85%,65%,0.5)',
              'hsl(270,55%,70%,0.4)',
              'hsl(330,65%,65%,0.35)',
              'hsl(175,55%,55%,0.4)',
            ][i % 4],
            animationDelay: `${i * 0.55}s`,
            animationDuration: `${6 + i * 0.4}s`,
          }}
        />
      ))}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: '70vw', height: '70vw', background: 'radial-gradient(circle, hsl(270,55%,30%,0.07) 0%, transparent 65%)' }} />
    </div>
  );
}

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

function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', () => { setPlayingUrl(null); setProgress(0); });
    audio.addEventListener('canplay', () => setLoading(false));
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  const play = (url: string) => {
    const audio = audioRef.current!;
    if (playingUrl === url) {
      if (audio.paused) { audio.play(); }
      else { audio.pause(); setPlayingUrl(null); }
      return;
    }
    setLoading(true);
    audio.pause();
    audio.src = url;
    audio.load();
    audio.play().catch(() => setLoading(false));
    setPlayingUrl(url);
    setProgress(0);
  };

  const seek = (pct: number) => {
    const audio = audioRef.current!;
    if (audio.duration) audio.currentTime = pct * audio.duration;
  };

  const stop = () => {
    const audio = audioRef.current!;
    audio.pause();
    audio.currentTime = 0;
    setPlayingUrl(null);
    setProgress(0);
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return { playingUrl, progress, duration, loading, play, seek, stop, fmtTime };
}

export default function MoodSection() {
  const [selected, setSelected] = useState<Mood | null>(null);
  const [uploadedTracks, setUploadedTracks] = useState<UploadedTrack[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const player = useAudioPlayer();

  useEffect(() => {
    if (!selected) return;
    fetch(`${TRACKS_URL}?mood=${selected.id}`)
      .then(r => r.json())
      .then(data => {
        const filtered = (data.tracks || []).filter((t: UploadedTrack) =>
          t.key.includes(`/${selected.id}/`)
        );
        setUploadedTracks(filtered);
      })
      .catch(() => setUploadedTracks([]));
  }, [selected]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selected) return;
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg)$/i)) {
      setUploadError('Поддерживаются только MP3, WAV, OGG');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const b64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch(TRACKS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, data: b64, mood: selected.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setUploadError(err.error || `Ошибка сервера: ${res.status}`);
        return;
      }
      const data = await res.json();
      if (data.url) {
        setUploadedTracks(prev => [...prev, { key: data.key, name: data.name, url: data.url, size: file.size }]);
      } else {
        setUploadError(data.error || 'Ошибка загрузки');
      }
    } catch {
      setUploadError('Не удалось загрузить файл. Попробуйте ещё раз.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (track: UploadedTrack) => {
    player.stop();
    await fetch(`${TRACKS_URL}?key=${encodeURIComponent(track.key)}`, { method: 'DELETE' });
    setUploadedTracks(prev => prev.filter(t => t.key !== track.key));
  };

  const fmtSize = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} КБ`
    : `${(bytes / 1024 / 1024).toFixed(1)} МБ`;

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
            Выберите настроение — загрузите треки и слушайте
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-9 gap-3 mb-10">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => { setSelected(mood); player.stop(); setUploadError(null); }}
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
                <MusicBars playing={player.playingUrl !== null} color={selected.color} />
              </div>
            </div>

            {uploadedTracks.length > 0 && (
              <div className="mb-6">
                <p className="text-xs tracking-widest uppercase mb-3 font-body" style={{ color: 'hsl(240, 10%, 45%)' }}>
                  Ваши треки
                </p>
                <div className="flex flex-col gap-2">
                  {uploadedTracks.map((track) => (
                    <div
                      key={track.key}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'hsl(240, 20%, 7%)', border: '1px solid hsl(240, 15%, 15%)' }}
                    >
                      <button
                        onClick={() => player.play(track.url)}
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
                        style={{ background: player.playingUrl === track.url ? selected.color : 'hsl(240, 15%, 20%)' }}
                      >
                        <Icon
                          name={player.playingUrl === track.url ? 'Pause' : 'Play'}
                          size={14}
                          style={{ color: player.playingUrl === track.url ? 'hsl(240,20%,6%)' : 'hsl(45,20%,75%)' }}
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body truncate" style={{ color: 'hsl(45, 20%, 80%)' }}>{track.name}</p>
                        <p className="text-xs font-body" style={{ color: 'hsl(240, 10%, 45%)' }}>{fmtSize(track.size)}</p>
                        {player.playingUrl === track.url && (
                          <div
                            className="mt-1 rounded-full overflow-hidden cursor-pointer"
                            style={{ height: '3px', background: 'hsl(240, 15%, 20%)' }}
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              player.seek((e.clientX - rect.left) / rect.width);
                            }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${player.progress * 100}%`, background: selected.color }}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(track)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-70"
                        style={{ background: 'hsl(0, 60%, 20%)' }}
                      >
                        <Icon name="Trash2" size={12} style={{ color: 'hsl(0, 60%, 65%)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase mb-3 font-body" style={{ color: 'hsl(240, 10%, 45%)' }}>
                Рекомендованные треки
              </p>
              <div className="flex flex-col gap-2">
                {selected.tracks.map((track, idx) => (
                  <a
                    key={idx}
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(track.ytSearch)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3 rounded-xl transition-all hover:opacity-80"
                    style={{ background: 'hsl(240, 20%, 7%)', border: '1px solid hsl(240, 15%, 15%)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${selected.color}20` }}
                    >
                      <Icon name="Music" size={14} style={{ color: selected.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-medium truncate" style={{ color: 'hsl(45, 20%, 85%)' }}>{track.title}</p>
                      <p className="text-xs font-body" style={{ color: 'hsl(240, 10%, 50%)' }}>{track.composer} · {track.genre}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-body" style={{ color: 'hsl(240, 10%, 50%)' }}>{track.duration}</p>
                      <p className="text-xs font-body" style={{ color: selected.color }}>{track.freq}</p>
                    </div>
                    <Icon name="ExternalLink" size={14} style={{ color: 'hsl(240, 10%, 40%)' }} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.ogg,audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              {uploadError && (
                <div className="mb-3 p-3 rounded-xl flex items-center gap-2" style={{ background: 'hsl(0, 60%, 15%, 0.5)', border: '1px solid hsl(0, 60%, 35%, 0.5)' }}>
                  <Icon name="AlertCircle" size={14} style={{ color: 'hsl(0, 60%, 65%)' }} />
                  <span className="text-xs font-body" style={{ color: 'hsl(0, 40%, 75%)' }}>{uploadError}</span>
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full py-3 rounded-2xl border font-body text-sm font-medium transition-all hover:opacity-80 flex items-center justify-center gap-2"
                style={{
                  borderColor: selected.color,
                  color: selected.color,
                  background: `${selected.color}10`,
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                <Icon name={uploading ? 'Loader2' : 'Upload'} size={16} className={uploading ? 'animate-spin' : ''} />
                {uploading ? 'Загружаю...' : 'Загрузить свой трек'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
