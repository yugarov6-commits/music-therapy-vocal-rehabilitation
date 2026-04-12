import { useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import type { useVoiceAnalyzer } from '@/components/exercises/useVoiceAnalyzer';

type VoiceState = ReturnType<typeof useVoiceAnalyzer>;

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

export default function ExerciseVoicePanel({ voice }: { voice: VoiceState }) {
  return (
    <>
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
    </>
  );
}
