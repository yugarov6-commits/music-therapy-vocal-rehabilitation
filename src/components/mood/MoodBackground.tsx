export function WaveBackground() {
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

export function MusicBars({ playing = false, color = 'hsl(45,70%,65%)' }: { playing?: boolean; color?: string }) {
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
