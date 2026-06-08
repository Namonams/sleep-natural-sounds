import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

const W = 1280;
const H = 720;
const FPS = 24;
const TOTAL_S = 10;
const DROP_COUNT = 220;

// Angle pluie (légèrement diagonal, naturel)
const ANGLE_RAD = Math.PI / 12; // 15°
const VX = Math.sin(ANGLE_RAD);
const VY = Math.cos(ANGLE_RAD);
const SPEED_PX_S = 420; // px/sec

function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

interface Drop {
  x0: number;  // position initiale X
  y0: number;  // position initiale Y
  len: number; // longueur de la traînée en px
  width: number;
  opacity: number;
  offset: number; // décalage temporel pour éviter synchronisation
}

interface Props {
  seed?: number;
}

export const RainLoop: React.FC<Props> = ({ seed = 42 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const drops = useMemo<Drop[]>(() => {
    const rand = seededRand(seed);
    return Array.from({ length: DROP_COUNT }, () => ({
      x0: rand() * (W + 200) - 100,
      y0: rand() * (H + 200) - 100,
      len: 18 + rand() * 30,
      width: 0.8 + rand() * 1.2,
      opacity: 0.08 + rand() * 0.18,
      offset: rand() * TOTAL_S, // sec
    }));
  }, [seed]);

  // secondes réelles (loop parfait sur 30s)
  const t = (frame / FPS) % TOTAL_S;

  return (
    <AbsoluteFill>
      {/* Fond sombre chaud — identique à charte chaîne */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 40% 30%, #13100C 0%, #0D0A08 60%, #080605 100%)',
        }}
      />

      {/* Lueur ambiante très subtile — braise lointaine */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 70% 80%, rgba(60,30,10,0.12) 0%, transparent 55%)',
        }}
      />

      {/* Gouttes de pluie */}
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
      >
        {drops.map((drop, i) => {
          // temps ajusté avec l'offset de la goutte (loop parfait)
          const dropT = ((t + drop.offset) % TOTAL_S);
          const dist = dropT * SPEED_PX_S;

          const tx = drop.x0 + VX * dist;
          const ty = drop.y0 + VY * dist;

          // Traînée : du point tail au head
          const tailX = tx - VX * drop.len;
          const tailY = ty - VY * drop.len;

          // Skip si complètement hors écran
          if (tx < -50 && tailX < -50) return null;
          if (ty > H + 50 && tailY > H + 50) return null;

          return (
            <line
              key={i}
              x1={tailX}
              y1={tailY}
              x2={tx}
              y2={ty}
              stroke={`rgba(200, 210, 230, ${drop.opacity})`}
              strokeWidth={drop.width}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Brume légère en bas */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: 'linear-gradient(to top, rgba(10,8,6,0.4) 0%, transparent 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
