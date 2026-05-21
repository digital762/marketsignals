interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  showDot?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  stroke = "#1F343F",
  fill = "none",
  showDot = true,
  className,
}: SparklineProps) {
  if (!data.length) return null;
  const max = Math.max(...data, 0.001);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1 || 1)) * w;
    const y = pad + h - ((v - min) / range) * h;
    return [x, y] as const;
  });

  const d = points
    .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
    .join(" ");

  let area: string | null = null;
  if (fill !== "none") {
    const last = points[points.length - 1];
    const first = points[0];
    area = `${d} L ${last[0]} ${pad + h} L ${first[0]} ${pad + h} Z`;
  }

  const lastPoint = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="trend"
    >
      {area && <path d={area} fill={fill} stroke="none" opacity={0.18} />}
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {showDot && (
        <circle cx={lastPoint[0]} cy={lastPoint[1]} r={2.5} fill={stroke} />
      )}
    </svg>
  );
}
