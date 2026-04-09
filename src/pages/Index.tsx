import { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '@/func2url.json';

const TRACKS_URL = func2url.tracks;

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
  ytSearch: string;
};

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

// ─── Wave Background ──────────────────────────────────────────────────────────

function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Big orbs */}
      <div className="orb animate-orb" style={{ width: '500px', height: '500px', top: '-10%', left: '-8%', background: 'hsl(270,55%,28%,0.4)' }} />
      <div className="orb animate-orb" style={{ width: '400px', height: '400px', bottom: '-5%', right: '-5%', background: 'hsl(200,60%,22%,0.35)', animationDelay: '4s' }} />
      <div className="orb" style={{ width: '300px', height: '300px', top: '40%', left: '55%', background: 'hsl(330,55%,20%,0.25)' }} />

      {/* Waves */}
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

      {/* Floating particles */}
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

      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: '70vw', height: '70vw', background: 'radial-gradient(circle, hsl(270,55%,30%,0.07) 0%, transparent 65%)' }} />
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

// ─── Audio Player Hook ────────────────────────────────────────────────────────

type UploadedTrack = { key: string; name: string; url: string; size: number };

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

  const play = useCallback((url: string) => {
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
  }, [playingUrl]);

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current!;
    if (audio.duration) audio.currentTime = pct * audio.duration;
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current!;
    audio.pause();
    audio.currentTime = 0;
    setPlayingUrl(null);
    setProgress(0);
  }, []);

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return { playingUrl, progress, duration, loading, play, seek, stop, fmtTime };
}

// ─── Section: Mood ────────────────────────────────────────────────────────────

function MoodSection() {
  const [selected, setSelected] = useState<Mood | null>(null);
  const [uploadedTracks, setUploadedTracks] = useState<UploadedTrack[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const player = useAudioPlayer();

  // Загружаем список треков при выборе настроения
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
            {/* Header */}
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

            {/* Uploaded tracks */}
            {uploadedTracks.length > 0 && (
              <div className="flex flex-col gap-3 mb-5">
                {uploadedTracks.map((track) => {
                  const isPlaying = player.playingUrl === track.url;
                  const displayName = track.name.replace(/_/g, ' ').replace(/\.(mp3|wav|ogg)$/i, '');
                  return (
                    <div
                      key={track.key}
                      className="rounded-2xl border transition-all duration-200"
                      style={{
                        background: isPlaying ? `${selected.color}12` : 'hsl(240, 20%, 7%)',
                        borderColor: isPlaying ? selected.color : 'hsl(240, 15%, 15%)',
                      }}
                    >
                      <div className="flex items-center gap-3 p-4">
                        <button
                          onClick={() => player.play(track.url)}
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
                          style={{ background: `${selected.color}25` }}
                        >
                          {player.loading && isPlaying
                            ? <Icon name="Loader" size={16} style={{ color: selected.color }} className="animate-spin" />
                            : isPlaying
                              ? <Icon name="Pause" size={16} style={{ color: selected.color }} />
                              : <Icon name="Play" size={16} style={{ color: selected.color }} />
                          }
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-medium text-sm truncate" style={{ color: 'hsl(45, 20%, 88%)' }}>{displayName}</p>
                          <p className="text-xs font-body" style={{ color: 'hsl(240, 10%, 45%)' }}>{fmtSize(track.size)}</p>
                        </div>
                        {isPlaying && (
                          <span className="text-xs font-body tabular-nums" style={{ color: selected.color }}>
                            {player.fmtTime(player.progress * player.duration)}
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(track)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70 flex-shrink-0"
                          style={{ background: 'hsl(240, 15%, 14%)' }}
                        >
                          <Icon name="Trash2" size={13} style={{ color: 'hsl(240, 10%, 40%)' }} />
                        </button>
                      </div>

                      {/* Progress bar */}
                      {isPlaying && (
                        <div
                          className="mx-4 mb-3 rounded-full overflow-hidden cursor-pointer"
                          style={{ height: '3px', background: 'hsl(240, 15%, 18%)' }}
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            player.seek((e.clientX - rect.left) / rect.width);
                          }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-200"
                            style={{ width: `${player.progress * 100}%`, background: selected.color }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recommended tracks */}
            <div className="mb-5">
              <p className="text-xs tracking-widest uppercase mb-3 font-body" style={{ color: 'hsl(240, 10%, 40%)' }}>
                Рекомендованные треки — найдите и скачайте
              </p>
              <div className="flex flex-col gap-2">
                {selected.tracks.map((track, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: 'hsl(240, 20%, 7%)', border: '1px solid hsl(240, 15%, 14%)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm truncate" style={{ color: 'hsl(45, 15%, 75%)' }}>{track.title}</p>
                      <p className="text-xs font-body" style={{ color: 'hsl(240, 10%, 42%)' }}>{track.composer} · {track.genre} · {track.freq}</p>
                    </div>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(track.ytSearch)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs flex-shrink-0 transition-all hover:opacity-80"
                      style={{ background: `${selected.color}20`, color: selected.color, border: `1px solid ${selected.color}30` }}
                    >
                      <Icon name="ExternalLink" size={11} />
                      Найти
                    </a>
                  </div>
                ))}
              </div>
              {/* Download instruction */}
              <div className="mt-4 rounded-2xl p-4" style={{ background: 'hsl(240, 18%, 8%)', border: '1px solid hsl(240, 15%, 16%)' }}>
                <p className="text-xs font-body font-medium mb-3" style={{ color: 'hsl(45, 20%, 70%)' }}>
                  Как скачать трек
                </p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { step: '1', text: 'Нажмите «Найти» — откроется YouTube с нужным треком', icon: 'Search' },
                    { step: '2', text: 'Скопируйте ссылку на видео из адресной строки', icon: 'Link' },
                    { step: '3', text: 'Откройте yt1s.com или y2mate.com, вставьте ссылку', icon: 'ExternalLink' },
                    { step: '4', text: 'Выберите формат MP3 и скачайте файл', icon: 'Download' },
                    { step: '5', text: 'Нажмите «Загрузить трек» ниже и выберите скачанный файл', icon: 'Upload' },
                  ].map(({ step, text, icon }) => (
                    <div key={step} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-body mt-0.5"
                        style={{ background: `${selected.color}25`, color: selected.color }}
                      >
                        {step}
                      </div>
                      <div className="flex items-start gap-2 flex-1">
                        <Icon name={icon as 'Search' | 'Link' | 'ExternalLink' | 'Download' | 'Upload'} size={12} className="mt-0.5 flex-shrink-0" style={{ color: 'hsl(240, 10%, 40%)' }} />
                        <p className="text-xs font-body leading-relaxed" style={{ color: 'hsl(240, 10%, 50%)' }}>{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload zone */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.ogg,audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full py-4 rounded-2xl border-2 border-dashed font-body text-sm transition-all hover:opacity-80 flex items-center justify-center gap-2"
                style={{
                  borderColor: `${selected.color}40`,
                  color: uploading ? selected.color : 'hsl(240, 10%, 50%)',
                  background: 'transparent',
                }}
              >
                {uploading
                  ? <><Icon name="Loader" size={16} style={{ color: selected.color }} className="animate-spin" /> Загружаю...</>
                  : <><Icon name="Upload" size={16} style={{ color: selected.color }} /> Загрузить трек (MP3, WAV, OGG)</>
                }
              </button>
              {uploadError && (
                <p className="text-xs font-body mt-2 text-center" style={{ color: 'hsl(0, 65%, 60%)' }}>{uploadError}</p>
              )}
              {uploadedTracks.length === 0 && !uploading && (
                <p className="text-xs font-body mt-2 text-center" style={{ color: 'hsl(240, 10%, 38%)' }}>
                  Загруженных треков для этого настроения пока нет
                </p>
              )}
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

              {/* Warning */}
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