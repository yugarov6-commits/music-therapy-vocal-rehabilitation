import { useState, useEffect } from 'react';
import func2url from '@/func2url.json';
import { MOODS } from '@/components/mood/mood.types';
import type { Mood, UploadedTrack } from '@/components/mood/mood.types';
import { WaveBackground } from '@/components/mood/MoodBackground';
import { useAudioPlayer } from '@/components/mood/useAudioPlayer';
import MoodPlayerCard from '@/components/mood/MoodPlayerCard';

const TRACKS_URL = func2url.tracks;

export default function MoodSection() {
  const [selected, setSelected] = useState<Mood | null>(null);
  const [uploadedTracks, setUploadedTracks] = useState<UploadedTrack[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
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
      e.target.value = '';
    }
  };

  const handleDelete = async (track: UploadedTrack) => {
    player.stop();
    await fetch(`${TRACKS_URL}?key=${encodeURIComponent(track.key)}`, { method: 'DELETE' });
    setUploadedTracks(prev => prev.filter(t => t.key !== track.key));
  };

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
          <MoodPlayerCard
            selected={selected}
            uploadedTracks={uploadedTracks}
            uploading={uploading}
            uploadError={uploadError}
            player={player}
            onFileUpload={handleFileUpload}
            onDelete={handleDelete}
          />
        )}
      </div>
    </section>
  );
}
