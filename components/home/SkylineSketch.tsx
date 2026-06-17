const BUILDINGS = [
  { x: 0, w: 60, h: 120 },
  { x: 65, w: 40, h: 180 },
  { x: 110, w: 70, h: 90 },
  { x: 185, w: 30, h: 220 },
  { x: 220, w: 55, h: 140 },
  { x: 280, w: 45, h: 260 },
  { x: 330, w: 65, h: 100 },
  { x: 400, w: 35, h: 200 },
  { x: 440, w: 80, h: 160 },
  { x: 525, w: 40, h: 300 },
  { x: 570, w: 60, h: 130 },
  { x: 635, w: 30, h: 240 },
  { x: 670, w: 70, h: 110 },
  { x: 745, w: 50, h: 190 },
  { x: 800, w: 45, h: 270 },
  { x: 850, w: 65, h: 150 },
  { x: 920, w: 35, h: 210 },
  { x: 960, w: 75, h: 100 },
  { x: 1040, w: 40, h: 230 },
  { x: 1085, w: 55, h: 160 },
  { x: 1145, w: 30, h: 280 },
  { x: 1180, w: 70, h: 120 },
  { x: 1255, w: 45, h: 200 },
  { x: 1305, w: 60, h: 140 },
  { x: 1370, w: 70, h: 180 },
];

const HEIGHT = 320;

export function SkylineSketch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={`0 0 1440 ${HEIGHT}`}
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      {...props}
    >
      {BUILDINGS.map((b, i) => (
        <g key={i} opacity={0.5}>
          <rect x={b.x} y={HEIGHT - b.h} width={b.w} height={b.h} />
          {Array.from({ length: Math.max(2, Math.floor(b.h / 26)) }).map((_, row) => (
            <line
              key={row}
              x1={b.x}
              x2={b.x + b.w}
              y1={HEIGHT - b.h + (row + 1) * 22}
              y2={HEIGHT - b.h + (row + 1) * 22}
              opacity={0.4}
            />
          ))}
        </g>
      ))}
      <circle cx="1180" cy="64" r="40" opacity={0.3} />
    </svg>
  );
}
