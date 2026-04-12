import { useRef } from 'react';
import Icon from '@/components/ui/icon';
import { MusicBars } from '@/components/mood/MoodBackground';
import { useAudioPlayer } from '@/components/mood/useAudioPlayer';
import type { Mood, UploadedTrack } from '@/components/mood/mood.types';
import func2url from '@/func2url.json';

const TRACKS_URL = func2url.tracks;

type Props = {
  selected: Mood;
  uploadedTracks: UploadedTrack[];
  uploading: boolean;
  uploadError: string | null;
  player: ReturnType<typeof useAudioPlayer>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (track: UploadedTrack) => void;
};

const fmtSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} КБ`
    : `${(bytes / 1024 / 1024).toFixed(1)} МБ`;

export default function MoodPlayerCard({
  selected,
  uploadedTracks,
  uploading,
  uploadError,
  player,
  onFileUpload,
  onDelete,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
                  onClick={() => onDelete(track)}
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

      {/* Recommended tracks */}
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

      {/* Upload */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.ogg,audio/*"
          className="hidden"
          onChange={onFileUpload}
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
  );
}
