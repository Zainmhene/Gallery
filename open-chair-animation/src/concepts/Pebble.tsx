import React from 'react';
import type {Concept, PartProps} from './types';

const INK = '#231c3d';
const TONES = [
  {light: '#ddd2ff', base: '#a48cf5', dark: '#6a52c8'},
  {light: '#cdf7e3', base: '#6fd3a8', dark: '#2c9773'},
] as const;

const bodyId = (uid: string, variant: 0 | 1) => `${uid}-body-${variant}`;
const capId = (uid: string) => `${uid}-cap`;
const skyId = (uid: string) => `${uid}-sky`;
const shadowId = (uid: string) => `${uid}-contact`;

const line = {fill: 'none', stroke: INK, strokeWidth: 7, strokeLinecap: 'round'} as const;

const Eye: React.FC<{readonly x: number; readonly ry: number}> = ({x, ry}) => (
  <>
    <ellipse cx={x} cy={0} rx={13} ry={ry} fill={INK} />
    <circle cx={x - 4} cy={-ry * 0.35} r={ry > 12 ? 5 : 3} fill="#fff" />
  </>
);

const Face: React.FC<Pick<PartProps, 'expression'>> = ({expression}) => {
  if (expression === 'happy')
    return (
      <>
        <path d="M-78 6Q-62 -16 -46 6M46 6Q62 -16 78 6" {...line} />
        <path d="M-22 26Q0 62 22 26Z" fill={INK} />
      </>
    );
  if (expression === 'surprised')
    return (
      <>
        <Eye x={-62} ry={21} />
        <Eye x={62} ry={21} />
        <ellipse cx={0} cy={42} rx={10} ry={13} fill={INK} />
      </>
    );
  if (expression === 'sceptical')
    return (
      <>
        <Eye x={-62} ry={9} />
        <Eye x={62} ry={17} />
        <path d="M-4 40L22 31" {...line} />
        <path d="M44 -34L82 -28" {...line} />
      </>
    );
  return (
    <>
      <Eye x={-62} ry={17} />
      <Eye x={62} ry={17} />
      <path d="M-12 34Q0 41 12 34" {...line} />
    </>
  );
};

const Body: React.FC<PartProps & {readonly hands: boolean}> = ({variant, expression, uid, hands}) => {
  const fill = `url(#${bodyId(uid, variant)})`;
  const cap = `url(#${capId(uid)})`;
  return (
    <>
      <ellipse cx={0} cy={-2} rx={200} ry={26} fill={`url(#${shadowId(uid)})`} />
      <ellipse cx={-62} cy={-16} rx={48} ry={22} fill={TONES[variant].dark} />
      <ellipse cx={62} cy={-16} rx={48} ry={22} fill={TONES[variant].dark} />
      <path d="M0 -430C110 -430 160 -300 160 -180C160 -60 100 -20 0 -20C-100 -20 -160 -60 -160 -180C-160 -300 -110 -430 0 -430Z" fill={fill} />
      {hands ? (
        <>
          <circle cx={-196} cy={-190} r={34} fill={fill} />
          {variant === 0 ? <circle cx={204} cy={-312} r={34} fill={fill} /> : <circle cx={196} cy={-190} r={34} fill={fill} />}
        </>
      ) : null}
      {variant === 0 ? (
        <>
          <circle cx={0} cy={-444} r={24} fill={cap} />
          <path d="M-116 -366C-94 -420 -50 -434 0 -434C50 -434 94 -420 116 -366C60 -390 -60 -390 -116 -366Z" fill={cap} />
        </>
      ) : null}
      <g transform="translate(0 -290)">
        <ellipse cx={-100} cy={38} rx={26} ry={15} fill="#ff7d9a" opacity={0.5} />
        <ellipse cx={100} cy={38} rx={26} ry={15} fill="#ff7d9a" opacity={0.5} />
        <Face expression={expression} />
        {variant === 1 ? (
          <>
            <circle cx={-62} cy={0} r={34} fill="none" stroke={INK} strokeWidth={6} />
            <circle cx={62} cy={0} r={34} fill="none" stroke={INK} strokeWidth={6} />
            <path d="M-28 0H28" stroke={INK} strokeWidth={6} />
          </>
        ) : null}
      </g>
    </>
  );
};

export const pebble: Concept = {
  id: 'pebble',
  name: 'Pebble',
  bgColor: '#cfe0ff',
  idea: 'Soft, rounded and lit like a clay model. Head and body are one smooth stone with floating hands. The only concept that would be built in 3D.',
  specs: [
    ['Height', '1.5 heads; head and body are a single form'],
    ['Outline', 'None. Form comes from light and shadow'],
    ['Face', 'Tiny glossy eyes set far apart, blush, no nose'],
    ['Colour', 'Pastel body colours with soft gradients'],
    ['Motion', 'Squash, stretch and float; hands move freely with no arms'],
  ],
  palette: ['#cfe0ff', '#a48cf5', '#6fd3a8', '#ff7d6b', INK, '#f6f0ff'],
  compare: ['None (shading)', '1.5 heads', 'Good. Faces are small on the body', 'High (Three.js, lighting, render time)', 'Cute rounded mascots are a crowded space'],
  faceViewBox: '-230 -490 460 490',
  Defs: ({uid}) => (
    <>
      {([0, 1] as const).map((v) => (
        <radialGradient key={v} id={bodyId(uid, v)} cx={0.36} cy={0.26} r={0.85}>
          <stop offset={0} stopColor={TONES[v].light} />
          <stop offset={0.55} stopColor={TONES[v].base} />
          <stop offset={1} stopColor={TONES[v].dark} />
        </radialGradient>
      ))}
      <radialGradient id={capId(uid)} cx={0.4} cy={0.2} r={0.9}>
        <stop offset={0} stopColor="#ffb3a6" />
        <stop offset={0.6} stopColor="#ff7d6b" />
        <stop offset={1} stopColor="#d9523f" />
      </radialGradient>
      <linearGradient id={skyId(uid)} x1={0} y1={0} x2={0} y2={1}>
        <stop offset={0} stopColor="#b9dcff" />
        <stop offset={1} stopColor="#e8dcff" />
      </linearGradient>
      <radialGradient id={shadowId(uid)}>
        <stop offset={0} stopColor="#3a2f7a" stopOpacity={0.4} />
        <stop offset={1} stopColor="#3a2f7a" stopOpacity={0} />
      </radialGradient>
    </>
  ),
  Head: (props) => <Body {...props} hands={false} />,
  Character: (props) => <Body {...props} hands />,
  Chair: ({uid}) => {
    const fill = `url(#${capId(uid)})`;
    return (
      <>
        <ellipse cx={10} cy={-2} rx={150} ry={20} fill={`url(#${shadowId(uid)})`} />
        <rect x={62} y={-160} width={44} height={156} rx={20} fill={fill} />
        <rect x={-84} y={-350} width={52} height={346} rx={26} fill={fill} />
        <rect x={-84} y={-196} width={196} height={60} rx={30} fill={fill} />
      </>
    );
  },
  Background: ({width: W, height: H, groundY: gy, uid}) => (
    <>
      <rect width={W} height={H} fill={`url(#${skyId(uid)})`} />
      <ellipse cx={W / 2} cy={gy + 70} rx={W * 0.62} ry={170} fill="#f6f0ff" opacity={0.85} />
    </>
  ),
};
