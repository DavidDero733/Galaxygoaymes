import React, { useEffect, useRef } from 'react';

export type VitaTheme = 
  | 'vita_black_blue' 
  | 'vita_oled_blue' 
  | 'vita_cosmic_purple' 
  | 'vita_tokyo_neon' 
  | 'vita_emerald' 
  | 'vita_stealth_carbon'
  | 'vita_custom';

export interface CustomWaveSettings {
  bgColor?: string;
  waveColor1?: string;
  waveColor2?: string;
}

interface VitaAtmosphereProps {
  theme?: VitaTheme;
  customWaves?: CustomWaveSettings;
  speed?: 'Slow' | 'Normal' | 'Hyper' | 'Off';
}

interface ThemeConfig {
  bgBase: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  wave1: string;
  wave2: string;
  wave3: string;
  particleColor1: string;
  particleColor2: string;
  glow1: string;
  glow2: string;
  accent: string;
}

function hexToRgba(hex: string, alpha: number = 1): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(56, 189, 248, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const THEME_CONFIGS: Record<Exclude<VitaTheme, 'vita_custom'>, ThemeConfig> = {
  vita_black_blue: {
    bgBase: '#000000',
    gradientFrom: '#000000',
    gradientVia: '#010a1e',
    gradientTo: '#000000',
    wave1: 'rgba(30, 144, 255, 0.32)', // vibrant electric blue wave
    wave2: 'rgba(0, 102, 255, 0.24)',  // deep sapphire wave
    wave3: 'rgba(56, 189, 248, 0.22)', // sky blue crest
    particleColor1: 'rgba(56, 189, 248, 0.75)',
    particleColor2: 'rgba(30, 144, 255, 0.55)',
    glow1: 'rgba(30, 144, 255, 0.28)',
    glow2: 'rgba(0, 102, 255, 0.20)',
    accent: '#38bdf8'
  },
  vita_oled_blue: {
    bgBase: '#020612',
    gradientFrom: '#020817',
    gradientVia: '#071638',
    gradientTo: '#040b20',
    wave1: 'rgba(14, 116, 244, 0.16)',
    wave2: 'rgba(34, 211, 238, 0.12)',
    wave3: 'rgba(99, 102, 241, 0.14)',
    particleColor1: 'rgba(56, 189, 248, 0.65)',
    particleColor2: 'rgba(129, 140, 248, 0.5)',
    glow1: 'rgba(14, 165, 233, 0.18)',
    glow2: 'rgba(99, 102, 241, 0.15)',
    accent: '#38bdf8'
  },
  vita_cosmic_purple: {
    bgBase: '#050214',
    gradientFrom: '#07021a',
    gradientVia: '#1e0a3d',
    gradientTo: '#0a0322',
    wave1: 'rgba(168, 85, 247, 0.18)',
    wave2: 'rgba(236, 72, 153, 0.12)',
    wave3: 'rgba(99, 102, 241, 0.14)',
    particleColor1: 'rgba(192, 132, 252, 0.65)',
    particleColor2: 'rgba(244, 114, 182, 0.5)',
    glow1: 'rgba(168, 85, 247, 0.22)',
    glow2: 'rgba(236, 72, 153, 0.14)',
    accent: '#c084fc'
  },
  vita_tokyo_neon: {
    bgBase: '#030614',
    gradientFrom: '#040920',
    gradientVia: '#17062a',
    gradientTo: '#06132b',
    wave1: 'rgba(244, 63, 94, 0.15)',
    wave2: 'rgba(6, 182, 212, 0.16)',
    wave3: 'rgba(168, 85, 247, 0.12)',
    particleColor1: 'rgba(34, 211, 238, 0.7)',
    particleColor2: 'rgba(251, 113, 133, 0.6)',
    glow1: 'rgba(6, 182, 212, 0.2)',
    glow2: 'rgba(244, 63, 94, 0.18)',
    accent: '#22d3ee'
  },
  vita_emerald: {
    bgBase: '#010f0f',
    gradientFrom: '#011313',
    gradientVia: '#042724',
    gradientTo: '#021616',
    wave1: 'rgba(16, 185, 129, 0.15)',
    wave2: 'rgba(20, 184, 166, 0.14)',
    wave3: 'rgba(52, 211, 153, 0.1)',
    particleColor1: 'rgba(52, 211, 153, 0.65)',
    particleColor2: 'rgba(45, 212, 191, 0.5)',
    glow1: 'rgba(16, 185, 129, 0.18)',
    glow2: 'rgba(20, 184, 166, 0.15)',
    accent: '#34d399'
  },
  vita_stealth_carbon: {
    bgBase: '#07090e',
    gradientFrom: '#080a11',
    gradientVia: '#121622',
    gradientTo: '#090d16',
    wave1: 'rgba(255, 255, 255, 0.08)',
    wave2: 'rgba(148, 163, 184, 0.08)',
    wave3: 'rgba(203, 213, 225, 0.06)',
    particleColor1: 'rgba(226, 232, 240, 0.45)',
    particleColor2: 'rgba(148, 163, 184, 0.35)',
    glow1: 'rgba(255, 255, 255, 0.08)',
    glow2: 'rgba(148, 163, 184, 0.08)',
    accent: '#e2e8f0'
  }
};

export const VitaAtmosphere: React.FC<VitaAtmosphereProps> = ({ 
  theme = 'vita_black_blue',
  customWaves,
  speed = 'Normal'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Derive theme config dynamically if custom or preset
  const config: ThemeConfig = React.useMemo(() => {
    if (theme === 'vita_custom' && customWaves) {
      const bg = customWaves.bgColor || '#000000';
      const w1 = customWaves.waveColor1 || '#1e90ff';
      const w2 = customWaves.waveColor2 || '#00e5ff';
      return {
        bgBase: bg,
        gradientFrom: bg,
        gradientVia: hexToRgba(w1, 0.14),
        gradientTo: bg,
        wave1: hexToRgba(w1, 0.32),
        wave2: hexToRgba(w2, 0.24),
        wave3: hexToRgba(w1, 0.18),
        particleColor1: hexToRgba(w1, 0.75),
        particleColor2: hexToRgba(w2, 0.55),
        glow1: hexToRgba(w1, 0.25),
        glow2: hexToRgba(w2, 0.18),
        accent: w1
      };
    }
    return THEME_CONFIGS[theme as keyof typeof THEME_CONFIGS] || THEME_CONFIGS.vita_black_blue;
  }, [theme, customWaves]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Calm, subtle motes (peaceful and uncluttered)
    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1 + Math.random() * 2.2,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: -0.08 - Math.random() * 0.18,
      alpha: 0.12 + Math.random() * 0.35,
      pulseSpeed: 0.008 + Math.random() * 0.015,
      pulseVal: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const speedMultiplier = 
      speed === 'Slow' ? 0.4 : 
      speed === 'Hyper' ? 2.2 : 
      speed === 'Off' ? 0 : 1;

    const render = () => {
      t += 0.008 * speedMultiplier;
      ctx.clearRect(0, 0, width, height);

      // 1. Vita iconic undulating silk waves
      // Wave 1 - Deep primary silk wave
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 20) {
        const y = height * 0.65 + 
                  Math.sin(x * 0.002 + t * 0.5) * 45 + 
                  Math.cos(x * 0.001 - t * 0.3) * 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = config.wave1;
      ctx.fill();

      // Wave 2 - Counter-undulating soft wave
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 20) {
        const y = height * 0.75 + 
                  Math.sin(x * 0.0028 - t * 0.6) * 35 + 
                  Math.cos(x * 0.0015 + t * 0.4) * 25;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = config.wave2;
      ctx.fill();

      // Wave 3 - Soft upper wave accent
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 20) {
        const y = height * 0.55 + 
                  Math.sin(x * 0.0015 + t * 0.4) * 40 + 
                  Math.cos(x * 0.0022 + t * 0.25) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = config.wave3;
      ctx.fill();

      // 2. Soft, calm motes
      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulseVal += p.pulseSpeed;

        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        const dynamicAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulseVal));
        const color = idx % 2 === 0 ? config.particleColor1 : config.particleColor2;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        grad.addColorStop(0, color.replace(/[\d.]+\)$/, `${dynamicAlpha})`));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, [theme, config, speed]);

  return (
    <div 
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none transition-colors duration-700"
      style={{ backgroundColor: config.bgBase }}
    >
      {/* 1. Deep OLED rich radiant gradient */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 opacity-95"
        style={{
          background: `radial-gradient(ellipse 130% 90% at 50% -10%, ${config.gradientVia} 0%, ${config.gradientFrom} 55%, ${config.bgBase} 100%)`
        }}
      />

      {/* 2. Soft Ambient Orb Glows (Handheld OLED screen luminescence) */}
      <div 
        className="absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-colors duration-700"
        style={{ background: config.glow1 }}
      />
      <div 
        className="absolute top-1/3 -right-24 w-[480px] h-[480px] rounded-full blur-[130px] pointer-events-none opacity-30 transition-colors duration-700"
        style={{ background: config.glow2 }}
      />
      <div 
        className="absolute -bottom-24 left-1/3 w-[560px] h-[420px] rounded-full blur-[150px] pointer-events-none opacity-35 transition-colors duration-700"
        style={{ background: config.glow1 }}
      />

      {/* 3. Animated Canvas Waves & Gentle Floating Motes */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 4. Soft Vignette for OLED Depth */}
      <div 
        className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.7)]"
      />
    </div>
  );
};
