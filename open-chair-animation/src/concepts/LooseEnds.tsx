import React from 'react';
import {earc} from './geometry';
import type {Concept, PartProps} from './types';

const INK = '#1d2440';
const PAPER = '#ecebf4';
const YELLOW = '#ffb92e';

/** 0..1: how much of every line has been drawn. Lets a whole scene sketch itself on. */
export const DrawContext = React.createContext(1);

/** The one rule of this style: an even ink line that is never closed. */
export const Line: React.FC<{readonly d: string; readonly w?: number}> = ({d, w = 10}) => {
  const drawn = React.useContext(DrawContext);
  if (drawn <= 0) return null;
  return (
    <path
      d={d}
      fill="none"
      stroke={INK}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(drawn < 1 ? {pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - drawn} : {})}
    />
  );
};

const Mouth: React.FC<Pick<PartProps, 'expression'>> = ({expression}) => {
  if (expression === 'happy') return <Line d="M-18 40 Q2 62 24 40" w={8} />;
  if (expression === 'surprised')
    return (
      <>
        <Line d={earc(2, 50, 10, 12, 200, 510)} w={8} />
        <Line d="M-26 -36 L-8 -41" w={8} />
        <Line d="M12 -41 L30 -36" w={8} />
      </>
    );
  if (expression === 'sceptical')
    return (
      <>
        <Line d="M-12 50 L18 42" w={8} />
        <Line d="M-26 -30 L-6 -30" w={8} />
        <Line d="M10 -44 L30 -37" w={8} />
      </>
    );
  return <Line d="M-12 46 L16 46" w={8} />;
};

const Head: React.FC<PartProps> = ({variant, expression}) => {
  const eye = expression === 'surprised' ? 9 : 7;
  return (
    <>
      {variant === 1 ? <circle cx={14} cy={-100} r={28} fill={YELLOW} /> : null}
      <ellipse cx={16} cy={12} rx={62} ry={82} fill="#fff" />
      <circle cx={42} cy={30} r={14} fill={YELLOW} />
      <Line d={earc(0, 0, 62, 82, 140, 465)} />
      {variant === 0 ? (
        <Line d="M-30 -72 C-28 -124 36 -122 26 -86 C20 -66 -6 -78 4 -98" />
      ) : (
        <Line d={earc(0, -110, 28, 28, 125, 415)} />
      )}
      <circle cx={-14} cy={-12} r={eye} fill={INK} />
      <circle cx={18} cy={-12} r={eye} fill={INK} />
      <Line d="M2 -2 L-6 22 L8 22" w={8} />
      <Mouth expression={expression} />
    </>
  );
};

const Character: React.FC<PartProps> = (props) => {
  const colour = props.variant === 0 ? '#ff6b57' : '#19a89a';
  return (
    <>
      <rect x={-54} y={-446} width={140} height={232} rx={28} fill={colour} />
      <Line d="M-30 -224 L-34 -5 L-72 -5" />
      <Line d="M30 -224 L34 -5 L72 -5" />
      <Line d="M-70 -226 V-430 Q-70 -458 -42 -458 H42 Q70 -458 70 -430 V-226 H18" />
      <Line d="M0 -478 V-460" />
      <Line d="M-70 -418 Q-112 -370 -100 -290" />
      <Line d={earc(-100, -270, 16, 16, -60, 240)} />
      {props.variant === 0 ? (
        <>
          <Line d="M70 -418 Q132 -430 150 -500" />
          <Line d={earc(156, -518, 16, 16, 120, 420)} />
        </>
      ) : (
        <>
          <Line d="M70 -418 Q112 -370 100 -290" />
          <Line d={earc(100, -270, 16, 16, -60, 240)} />
        </>
      )}
      <g transform="translate(0 -560)">
        <Head {...props} />
      </g>
    </>
  );
};

export const looseEnds: Concept = {
  id: 'loose-ends',
  name: 'Loose Ends',
  bgColor: PAPER,
  idea: 'One even ink line that never closes. Every shape has a gap, and the colour sits slightly off the line like a misprinted poster.',
  specs: [
    ['Height', '4 heads tall, slim'],
    ['Outline', 'Single 10px navy line, always left open'],
    ['Face', 'Dot eyes set close, an L-shaped nose, one yellow cheek'],
    ['Colour', 'Navy ink plus three flat colours, shifted off the line'],
    ['Motion', 'Lines can draw themselves on; limbs bend like wire'],
  ],
  palette: [INK, PAPER, '#ff6b57', '#19a89a', YELLOW, '#ffffff'],
  compare: ['Open 10px line', '4 heads', 'Good. Thin limbs need a plain background', 'Low', 'Needs discipline: one closed shape breaks the rule'],
  faceViewBox: '-120 -140 260 260',
  Defs: () => null,
  Head,
  Character,
  Chair: () => (
    <>
      <rect x={-44} y={-138} width={130} height={26} fill={YELLOW} />
      <Line d="M-60 -310 V-5" />
      <Line d="M-60 -310 H-14" />
      <Line d="M-60 -150 H70 V-5" />
      <Line d="M-60 -72 H36" />
    </>
  ),
  Background: ({width: W, height: H, groundY}) => (
    <>
      <rect width={W} height={H} fill={PAPER} />
      <circle cx={W * 0.5 + 18} cy={H * 0.17 + 14} r={96} fill={YELLOW} />
      <Line d={earc(W * 0.5, H * 0.17, 96, 96, 20, 330)} w={12} />
      <Line d={`M${W * 0.06} ${groundY} H${W * 0.56}`} w={12} />
      <Line d={`M${W * 0.63} ${groundY} H${W * 0.94}`} w={12} />
    </>
  ),
};
