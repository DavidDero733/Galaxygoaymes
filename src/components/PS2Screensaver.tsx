import React, { useEffect, useRef } from 'react';

interface PS2ScreensaverProps {
  speed?: 'Slow' | 'Normal' | 'Hyper' | 'Off';
  colorTheme?: 'dark' | 'classic' | 'neon';
  scanlines?: boolean;
}

export const PS2Screensaver: React.FC<PS2ScreensaverProps> = ({
  speed = 'Normal',
  colorTheme = 'neon',
  scanlines = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Speed scalar
    let speedScalar = 1.0;
    if (speed === 'Slow') speedScalar = 0.4;
    if (speed === 'Hyper') speedScalar = 2.5;
    if (speed === 'Off') speedScalar = 0.0;

    // Define towers representing memory blocks
    interface Tower {
      x: number;
      y: number;
      z: number; // depth
      w: number;
      h: number; // height
      targetH: number;
      angle: number;
      rotSpeed: number;
      color: string;
      glowColor: string;
    }

    const towers: Tower[] = [];
    const colors = [
      { fill: 'rgba(0, 168, 204, 0.25)', glow: 'rgba(0, 168, 204, 0.8)' },
      { fill: 'rgba(0, 80, 239, 0.25)', glow: 'rgba(0, 80, 239, 0.8)' },
      { fill: 'rgba(111, 66, 193, 0.25)', glow: 'rgba(111, 66, 193, 0.8)' },
      { fill: 'rgba(23, 162, 184, 0.25)', glow: 'rgba(23, 162, 184, 0.8)' },
      { fill: 'rgba(0, 255, 100, 0.2)', glow: 'rgba(0, 255, 100, 0.75)' },
    ];

    // Seed 15 towers
    for (let i = 0; i < 16; i++) {
      const activeColor = colors[i % colors.length];
      towers.push({
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 1000 - 500,
        z: Math.random() * 800 + 200,
        w: 40 + Math.random() * 50,
        h: 150 + Math.random() * 300,
        targetH: 150 + Math.random() * 300,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() * 0.01 - 0.005) * speedScalar,
        color: activeColor.fill,
        glowColor: activeColor.glow,
      });
    }

    // Define background floating lights (orbital sparks)
    interface Spark {
      angle: number;
      radius: number;
      speed: number;
      yOffset: number;
      size: number;
      color: string;
    }
    const sparks: Spark[] = [];
    const sparkColors = ['#ff3b30', '#4cd964', '#ffcc00', '#5ac8fa', '#007aff'];
    for (let i = 0; i < 12; i++) {
      sparks.push({
        angle: Math.random() * Math.PI * 2,
        radius: 120 + Math.random() * 300,
        speed: (0.004 + Math.random() * 0.006) * speedScalar,
        yOffset: Math.random() * 300 - 150,
        size: 1.5 + Math.random() * 2,
        color: sparkColors[i % sparkColors.length],
      });
    }

    // Floating nebulae gas clouds
    interface Cloud {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      alpha: number;
      color: string;
    }
    const clouds: Cloud[] = [
      { x: width * 0.2, y: height * 0.3, targetX: width * 0.25, targetY: height * 0.35, size: 500, alpha: 0.12, color: '#011640' },
      { x: width * 0.8, y: height * 0.7, targetX: width * 0.75, targetY: height * 0.65, size: 650, alpha: 0.18, color: '#0c052e' },
      { x: width * 0.5, y: height * 0.5, targetX: width * 0.52, targetY: height * 0.48, size: 450, alpha: 0.15, color: '#002060' },
    ];

    let t = 0;

    const render = () => {
      t += 0.01 * speedScalar;

      // 1. Clear with gradient
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
      bgGrad.addColorStop(0, '#040b1e');
      bgGrad.addColorStop(0.5, '#020612');
      bgGrad.addColorStop(1, '#000004');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render background ambient gas clouds
      ctx.globalCompositeOperation = 'screen';
      clouds.forEach((cloud) => {
        // Drift cloud position
        cloud.x += (cloud.targetX - cloud.x) * 0.001 * speedScalar;
        cloud.y += (cloud.targetY - cloud.y) * 0.001 * speedScalar;

        if (Math.abs(cloud.x - cloud.targetX) < 10) {
          cloud.targetX = cloud.x + (Math.random() * 100 - 50);
          cloud.targetY = cloud.y + (Math.random() * 100 - 50);
        }

        const cloudGrad = ctx.createRadialGradient(cloud.x, cloud.y, 10, cloud.x, cloud.y, cloud.size);
        cloudGrad.addColorStop(0, cloud.color);
        cloudGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = cloudGrad;
        ctx.globalAlpha = cloud.alpha;
        ctx.fillRect(cloud.x - cloud.size, cloud.y - cloud.size, cloud.size * 2, cloud.size * 2);
      });
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';

      // 3. Draw drifting lines (the famous PS2 grid mist)
      ctx.strokeStyle = 'rgba(0, 168, 204, 0.04)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const baseOffset = height * 0.5 + Math.sin(t * 0.5 + i * 2) * 50;
        ctx.moveTo(0, baseOffset);
        ctx.bezierCurveTo(
          width * 0.25,
          baseOffset - 120 * Math.sin(t * 0.3 + i),
          width * 0.75,
          baseOffset + 120 * Math.cos(t * 0.2 + i),
          width,
          baseOffset - 20
        );
        ctx.stroke();
      }

      // 4. Render Orbital Clock Sparks
      sparks.forEach((spark) => {
        spark.angle += spark.speed;
        const currentRadius = spark.radius + Math.sin(t * 0.8 + spark.radius) * 15;
        const x = width / 2 + Math.cos(spark.angle) * currentRadius;
        const y = height / 2 + Math.sin(spark.angle * 1.5) * spark.yOffset;

        // Render double layer glow
        ctx.beginPath();
        ctx.arc(x, y, spark.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = 0.15;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, spark.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 5. Render iconic 3D Memory Card columns/towers
      // Sort towers by depth (Z) to render back to front
      towers.sort((a, b) => b.z - a.z);

      towers.forEach((tower) => {
        // Drift towers around or change heights slightly
        tower.angle += tower.rotSpeed;
        if (Math.random() < 0.002) {
          tower.targetH = 100 + Math.random() * 320;
        }
        tower.h += (tower.targetH - tower.h) * 0.02 * speedScalar;

        // Perspective projections
        // Vanishing point at screen center
        const fov = 600;
        const scale = fov / (fov + tower.z);
        const screenX = width / 2 + tower.x * scale;
        const screenY = height / 2 + tower.y * scale;

        // Apply circular orbit/drift in 3D
        tower.x += Math.sin(t * 0.1 + tower.angle) * 0.5 * speedScalar;
        tower.y += Math.cos(t * 0.08 + tower.angle) * 0.5 * speedScalar;

        // If tower gets too close, cycle it to the back
        tower.z -= 1.2 * speedScalar;
        if (tower.z < 20) {
          tower.z = 900;
          tower.x = Math.random() * 2000 - 1000;
          tower.y = Math.random() * 1000 - 500;
        }

        const sizeW = tower.w * scale;
        const sizeH = tower.h * scale;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(tower.angle * 0.2);

        // draw tower glow
        ctx.shadowBlur = 24 * scale;
        ctx.shadowColor = tower.glowColor;

        // Draw translucent column front face
        ctx.fillStyle = tower.color;
        ctx.strokeStyle = tower.glowColor;
        ctx.lineWidth = 1 * scale;

        // Glassy box draw
        ctx.beginPath();
        ctx.rect(-sizeW / 2, -sizeH / 2, sizeW, sizeH);
        ctx.fill();
        ctx.stroke();

        // High gloss edge line
        ctx.beginPath();
        ctx.moveTo(-sizeW / 2, -sizeH / 2);
        ctx.lineTo(-sizeW / 2, sizeH / 2);
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 0.45;
        ctx.stroke();

        ctx.restore();
      });

      // 6. Draw scanline/phosphor overlay if enabled
      if (scanlines) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        for (let i = 0; i < height; i += 3) {
          ctx.fillRect(0, i, width, 1.2);
        }
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [speed, colorTheme, scanlines]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-2] block w-full h-full"
    />
  );
};
