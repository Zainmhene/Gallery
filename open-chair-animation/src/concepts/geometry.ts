const r1 = (n: number) => Math.round(n * 10) / 10;

/** Elliptical arc from angle a0 to a1 in degrees, clockwise, 0 = right, 90 = down. */
export const earc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): string => {
  const t = Math.PI / 180;
  const x0 = cx + rx * Math.cos(a0 * t);
  const y0 = cy + ry * Math.sin(a0 * t);
  const x1 = cx + rx * Math.cos(a1 * t);
  const y1 = cy + ry * Math.sin(a1 * t);
  return `M${r1(x0)} ${r1(y0)}A${rx} ${ry} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${r1(x1)} ${r1(y1)}`;
};

/** Right-hand half of a rounded rectangle, used for flat shadow sides. */
export const rrHalf = (x0: number, y0: number, x1: number, y1: number, r: number): string =>
  `M${x0} ${y0}H${x1 - r}Q${x1} ${y0} ${x1} ${y0 + r}V${y1 - r}Q${x1} ${y1} ${x1 - r} ${y1}H${x0}Z`;

export const polygonPoints = (cx: number, cy: number, radii: readonly number[], stepDeg: number): string =>
  radii
    .map((r, i) => {
      const a = (i * stepDeg * Math.PI) / 180;
      return `${r1(cx + r * Math.cos(a))},${r1(cy + r * Math.sin(a))}`;
    })
    .join(' ');
