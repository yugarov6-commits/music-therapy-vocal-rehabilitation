import { useState, useRef, useCallback } from 'react';

export function useVoiceAnalyzer() {
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
