import { useState, useRef, useEffect } from 'react';

export function useAudioPlayer() {
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
