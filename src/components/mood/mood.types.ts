export type Track = {
  title: string;
  composer: string;
  genre: string;
  duration: string;
  freq: string;
  ytSearch: string;
};

export type Mood = {
  id: string;
  emoji: string;
  label: string;
  color: string;
  desc: string;
  tracks: Track[];
};

export type UploadedTrack = { key: string; name: string; url: string; size: number };

export const MOODS: Mood[] = [
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
  },
];
