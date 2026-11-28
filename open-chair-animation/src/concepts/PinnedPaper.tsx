import React from 'react';
import {polygonPoints} from './geometry';
import type {Concept, PartProps} from './types';

const INK = '#231a22';
const PLUM = '#4a2340';
const IVORY = '#f4ead2';
const SALMON = '#f2836b';

const shadowId = (uid: string) => `${uid}-paper-shadow`;

/** A cut sheet of paper: straight edges and a soft shadow on the layer below. */
const Sheet: React.FC<{readonly points: string; readonly fill: string; readonly uid: string}> = ({points, fill, uid}) => (
  <polygon points={points} fill={fill} filter={`url(#${shadowId(uid)})`} />
);

const Pin: React.FC<{readonly x: number; readonly y: number}> = ({x, y}) => (
  <>
    <circle cx={x} cy={y} r={8} fill="#d9b24c" />
    <circle cx={x} cy={y} r={2.5} fill="#5a4416" />
  </>
);

const Mouth: React.FC<Pick<PartProps, 'expression'>> = ({expression}) => {
  if (expression === 'happy') return <path d="M-28 50 L30 48 Q2 82 -28 50Z" fill={INK} />;
  if (expression === 'surprised')
    return (
      <>
        <polygon points="2,48 14,62 2,78 -10,62" fill={INK} />
        <polygon points="-50,-36 -22,-40 -22,-34 -50,-30" fill={INK} />
        <polygon points="22,-42 50,-38 50,-32 22,-36" fill={INK} />
      </>
    );
  if (expression === 'sceptical')
    return (
      <>
        <polygon points="-8,60 26,48 28,54 -6,66" fill={INK} />
        <polygon points="-50,-30 -22,-28 -22,-22 -50,-24" fill={INK} />
        <polygon points="20,-44 50,-34 49,-28 19,-38" fill={INK} />
      </>
    );
  return <polygon points="-18,56 20,54 20,60 -18,62" fill={INK} />;
};

const Head: React.FC<PartProps> = ({variant, expression, uid}) => {
  const skin = variant === 0 ? '#f0c29e' : '#a5673f';
  const nose = variant === 0 ? '#d99b72' : '#864e2d';
  const cheek = variant === 0 ? SALMON : '#cf5a40';
  const eye = expression === 'surprised' ? 9 : 7;
  return (
    <>
      {variant === 1 ? <Sheet uid={uid} fill="#1c2b2b" points="-98,-58 -32,-118 52,-112 104,-40 108,74 78,62 -84,66 -112,62" /> : null}
      <Sheet uid={uid} fill={skin} points="-70,-70 20,-92 78,-50 84,30 40,88 -40,84 -84,20" />
      <circle cx={-46} cy={28} r={15} fill={cheek} opacity={0.8} />
      <circle cx={50} cy={26} r={15} fill={cheek} opacity={0.8} />
      {variant === 0 ? (
        <Sheet uid={uid} fill={PLUM} points="-86,-64 -42,-112 30,-114 92,-60 82,-18 60,-48 20,-58 -20,-46 -50,-62 -80,-18" />
      ) : (
        <Sheet uid={uid} fill="#1c2b2b" points="-90,-50 -34,-110 50,-106 96,-42 80,-10 30,-60 -40,-56 -78,-8" />
      )}
      <circle cx={-34} cy={-10} r={eye} fill={INK} />
      <circle cx={34} cy={-12} r={eye} fill={INK} />
      <Sheet uid={uid} fill={nose} points="-4,-30 18,36 -14,34" />
      <Mouth expression={expression} />
    </>
  );
};

const ArmDown: React.FC<{readonly mirror: 1 | -1; readonly coat: string; readonly skin: string; readonly uid: string}> = ({mirror, coat, skin, uid}) => (
  <g transform={`scale(${mirror} 1)`}>
    <Sheet uid={uid} fill={skin} points="-128,-238 -98,-236 -96,-208 -112,-196 -128,-212" />
    <Sheet uid={uid} fill={coat} points="-112,-332 -88,-324 -98,-230 -118,-232" />
    <Sheet uid={uid} fill={coat} points="-64,-422 -38,-426 -90,-316 -112,-324" />
  </g>
);

const Character: React.FC<PartProps> = (props) => {
  const {variant, uid} = props;
  const coat = variant === 0 ? '#e0a82e' : '#9cc7d9';
  const skin = variant === 0 ? '#f0c29e' : '#a5673f';
  return (
    <>
      <Sheet uid={uid} fill={PLUM} points="-40,-250 -12,-250 -20,-20 -34,-20" />
      <Sheet uid={uid} fill={PLUM} points="12,-250 40,-250 34,-20 20,-20" />
      <Sheet uid={uid} fill={IVORY} points="-74,0 -16,0 -16,-24 -38,-26" />
      <Sheet uid={uid} fill={IVORY} points="74,0 16,0 16,-24 38,-26" />
      <ArmDown mirror={1} coat={coat} skin={skin} uid={uid} />
      {variant === 0 ? (
        <>
          <Sheet uid={uid} fill={skin} points="126,-450 156,-444 162,-472 146,-486 126,-476" />
          <Sheet uid={uid} fill={coat} points="102,-358 124,-346 154,-442 134,-448" />
          <Sheet uid={uid} fill={coat} points="38,-426 64,-422 122,-354 104,-338" />
        </>
      ) : (
        <ArmDown mirror={-1} coat={coat} skin={skin} uid={uid} />
      )}
      <polygon points="-15,-456 15,-456 15,-424 -15,-424" fill={skin} />
      <Sheet uid={uid} fill={coat} points="-60,-432 64,-428 98,-218 -94,-212" />
      <Sheet uid={uid} fill={IVORY} points="-32,-432 32,-430 2,-378" />
      <Pin x={-52} y={-416} />
      <Pin x={-101} y={-326} />
      <Pin x={52} y={-416} />
      {variant === 0 ? <Pin x={113} y={-350} /> : <Pin x={101} y={-326} />}
      <Pin x={-26} y={-238} />
      <Pin x={26} y={-238} />
      <g transform="translate(0 -530)">
        <Head {...props} />
      </g>
    </>
  );
};

export const pinnedPaper: Concept = {
  id: 'pinned-paper',
  name: 'Pinned Paper',
  bgColor: '#23483f',
  idea: 'Hand-cut paper puppets. Straight scissor edges, soft shadows between layers, and visible brass pins at every joint.',
  specs: [
    ['Height', '3 heads tall, coat widens toward the hem'],
    ['Outline', 'None. Edges come from the shadow under each layer'],
    ['Face', 'Long triangle nose in darker paper, round cheeks, slit mouth'],
    ['Colour', 'Muted craft papers on deep green; natural skin tones'],
    ['Motion', 'Parts swing on their pins like a real paper puppet'],
  ],
  palette: ['#23483f', '#e0a82e', '#9cc7d9', IVORY, PLUM, SALMON],
  compare: ['None (layer shadows)', '3 heads', 'Good. Shadows soften at small sizes', 'Medium', 'Slowest to build new characters and props'],
  faceViewBox: '-130 -135 260 260',
  Defs: ({uid}) => (
    <filter id={shadowId(uid)} x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx={0} dy={6} stdDeviation={5} floodColor="#07140f" floodOpacity={0.5} />
    </filter>
  ),
  Head,
  Character,
  Chair: ({uid}) => (
    <>
      <Sheet uid={uid} fill={IVORY} points="-72,-344 -44,-340 -38,0 -62,0" />
      <Sheet uid={uid} fill={IVORY} points="66,-160 90,-160 84,0 70,0" />
      <Sheet uid={uid} fill={SALMON} points="-76,-176 96,-182 98,-152 -74,-146" />
      <Pin x={-56} y={-162} />
      <Pin x={78} y={-166} />
    </>
  ),
  Background: ({width: W, height: H, groundY: gy, uid}) => (
    <>
      <rect width={W} height={H} fill="#23483f" />
      <Sheet uid={uid} fill="#e0a82e" points={polygonPoints(W * 0.48, H * 0.17, [96, 84, 96, 84, 96, 84, 96, 84, 96], 40)} />
      <Sheet
        uid={uid}
        fill="#2f5d50"
        points={`0,${gy - 200} ${W * 0.22},${gy - 330} ${W * 0.45},${gy - 210} ${W * 0.7},${gy - 380} ${W},${gy - 240} ${W},${H} 0,${H}`}
      />
      <Sheet uid={uid} fill="#18322b" points={`0,${gy - 26} ${W},${gy - 44} ${W},${H} 0,${H}`} />
    </>
  ),
};
