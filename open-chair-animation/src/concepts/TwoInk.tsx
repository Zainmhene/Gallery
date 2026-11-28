import React from 'react';
import type {Concept, PartProps} from './types';

const INK = '#2a1a3e';
const PINK = '#ff5a8a';
const BLUE = '#3d6bff';
const STOCK = '#fffdf5';
const YELLOW = '#ffe36e';

const stroke = {stroke: INK, strokeWidth: 14, strokeLinejoin: 'round', strokeLinecap: 'round'} as const;
const dotsId = (uid: string) => `${uid}-ink-dots`;
const pinkDotsId = (uid: string) => `${uid}-pink-dots`;

/** A filled, outlined shape with dot-screen shading on its right-hand side. */
const Screened: React.FC<{
  readonly clipId: string;
  readonly uid: string;
  readonly d: string;
  readonly fill: string;
  readonly box: readonly [number, number, number, number];
}> = ({clipId, uid, d, fill, box}) => (
  <>
    <clipPath id={clipId}>
      <path d={d} />
    </clipPath>
    <path d={d} fill={fill} />
    <rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} fill={`url(#${dotsId(uid)})`} opacity={0.55} clipPath={`url(#${clipId})`} />
    <path d={d} fill="none" {...stroke} />
  </>
);

const HEAD_PATH = 'M-60 -110C-20 -135 40 -135 70 -105C100 -75 120 20 110 70C100 115 40 125 0 125C-50 125 -105 115 -112 65C-120 10 -100 -80 -60 -110Z';
const BODY_PATH = 'M-70 -352C-112 -340 -132 -200 -122 -132H122C132 -200 112 -340 70 -352Z';

const browPath = (variant: 0 | 1, e: PartProps['expression']): string => {
  if (e === 'sceptical') return 'M-62 -54L62 -84';
  if (variant === 1) return e === 'happy' ? 'M-62 -56Q0 -78 62 -56' : 'M-62 -62H62';
  if (e === 'happy') return 'M-62 -60Q0 -86 62 -60';
  return e === 'surprised' ? 'M-62 -88H62' : 'M-62 -66H62';
};

const Mouth: React.FC<Pick<PartProps, 'expression'>> = ({expression}) => {
  if (expression === 'happy') return <path d="M-42 68Q0 110 42 68" fill="none" {...stroke} />;
  if (expression === 'surprised') return <ellipse cx={2} cy={86} rx={15} ry={19} fill={INK} />;
  if (expression === 'sceptical') return <path d="M-34 86Q-12 72 6 84T40 78" fill="none" {...stroke} />;
  return <path d="M-30 80H30" fill="none" {...stroke} />;
};

const Head: React.FC<PartProps> = ({variant, expression, uid}) => {
  const eye = expression === 'surprised' ? 13 : 9;
  return (
    <>
      <circle cx={-112} cy={4} r={26} fill={PINK} {...stroke} />
      <circle cx={112} cy={4} r={26} fill={PINK} {...stroke} />
      <Screened clipId={`${uid}-head-${variant}`} uid={uid} d={HEAD_PATH} fill={STOCK} box={[46, -140, 100, 280]} />
      {variant === 0 ? (
        <path d="M-22 -126L-34 -164M0 -130V-172M22 -126L36 -162" fill="none" {...stroke} />
      ) : (
        <path d="M-80 -88C-116 -190 -44 -256 0 -256C44 -256 116 -190 80 -88C40 -122 -40 -122 -80 -88Z" fill={BLUE} {...stroke} />
      )}
      <circle cx={-36} cy={-32} r={eye} fill={INK} />
      <circle cx={38} cy={-32} r={eye} fill={INK} />
      <path d={browPath(variant, expression)} fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
      <path d="M-22 -8C-30 52 34 52 26 -8Z" fill={PINK} />
      <path d="M-22 -8C-30 52 34 52 26 -8" fill="none" {...stroke} />
      <Mouth expression={expression} />
    </>
  );
};

const Arm: React.FC<{readonly d: string; readonly hx: number; readonly hy: number; readonly colour: string}> = ({d, hx, hy, colour}) => (
  <>
    <path d={d} fill="none" stroke={INK} strokeWidth={62} strokeLinecap="round" />
    <path d={d} fill="none" stroke={colour} strokeWidth={34} strokeLinecap="round" />
    <circle cx={hx} cy={hy} r={31} fill={STOCK} {...stroke} />
  </>
);

const Character: React.FC<PartProps> = (props) => {
  const {variant, uid} = props;
  const top = variant === 0 ? PINK : BLUE;
  const leg = variant === 0 ? BLUE : PINK;
  return (
    <>
      <rect x={-74} y={-150} width={58} height={120} fill={leg} {...stroke} />
      <rect x={16} y={-150} width={58} height={120} fill={leg} {...stroke} />
      <rect x={-100} y={-50} width={88} height={48} rx={22} fill={INK} {...stroke} />
      <rect x={12} y={-50} width={88} height={48} rx={22} fill={INK} {...stroke} />
      <Arm d="M-100 -300Q-158 -252 -150 -196" hx={-150} hy={-176} colour={top} />
      {variant === 0 ? (
        <Arm d="M100 -300Q168 -316 176 -392" hx={178} hy={-412} colour={top} />
      ) : (
        <Arm d="M100 -300Q158 -252 150 -196" hx={150} hy={-176} colour={top} />
      )}
      <Screened clipId={`${uid}-body-${variant}`} uid={uid} d={BODY_PATH} fill={top} box={[44, -360, 100, 240]} />
      <g transform="translate(0 -470)">
        <Head {...props} />
      </g>
    </>
  );
};

export const twoInk: Concept = {
  id: 'two-ink',
  name: 'Two-Ink',
  bgColor: YELLOW,
  idea: 'Printed, not drawn. A heavy stamp outline, two spot inks, and dot-screen shading like a cheap flyer run through a copier.',
  specs: [
    ['Height', '2.5 heads tall, pear-shaped head, big boots'],
    ['Outline', 'Heavy 14px line, always closed'],
    ['Face', 'One thick eyebrow bar does all the acting; large U nose'],
    ['Colour', 'Pink and blue ink on yellow stock, dots for shadow'],
    ['Motion', 'Chunky, held poses; the brow bar tilts and jumps'],
  ],
  palette: [YELLOW, PINK, BLUE, INK, STOCK],
  compare: ['Closed 14px line', '2.5 heads', 'Excellent. Loudest of the five', 'Medium', 'Thick outlines are common in cartoons; the dots and brow must carry it'],
  faceViewBox: '-165 -185 330 330',
  Defs: ({uid}) => (
    <>
      <pattern id={dotsId(uid)} width={13} height={13} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <circle cx={4} cy={4} r={3} fill={INK} />
      </pattern>
      <pattern id={pinkDotsId(uid)} width={22} height={22} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <circle cx={7} cy={7} r={6} fill={PINK} />
      </pattern>
    </>
  ),
  Head,
  Character,
  Chair: () => (
    <>
      <rect x={62} y={-150} width={36} height={143} rx={5} fill={BLUE} {...stroke} />
      <rect x={-78} y={-344} width={38} height={337} rx={5} fill={BLUE} {...stroke} />
      <rect x={-82} y={-186} width={186} height={42} rx={8} fill={PINK} {...stroke} />
    </>
  ),
  Background: ({width: W, height: H, groundY: gy, uid}) => (
    <>
      <rect width={W} height={H} fill={YELLOW} />
      <circle cx={W / 2} cy={gy - 360} r={Math.min(W, H) * 0.36} fill={`url(#${pinkDotsId(uid)})`} />
      <rect y={gy} width={W} height={H - gy} fill={STOCK} />
      <path d={`M0 ${gy}H${W}`} stroke={INK} strokeWidth={16} />
    </>
  ),
};
