import React from 'react';
import {rrHalf} from './geometry';
import type {Concept, PartProps} from './types';

const SHADE = 'rgba(16,14,60,.2)';
const DARK = '#1a1c4a';
const WHITE = '#fff';

const Face: React.FC<Pick<PartProps, 'expression'>> = ({expression}) => {
  if (expression === 'happy')
    return (
      <>
        <path d="M-78 6a28 28 0 0 1 56 0z" fill={WHITE} />
        <path d="M22 6a28 28 0 0 1 56 0z" fill={WHITE} />
        <circle cx={-50} cy={-6} r={10} fill={DARK} />
        <circle cx={50} cy={-6} r={10} fill={DARK} />
        <path d="M-36 42h72a36 32 0 0 1 -72 0z" fill={DARK} />
      </>
    );
  if (expression === 'surprised')
    return (
      <>
        <circle cx={-50} cy={-8} r={31} fill={WHITE} />
        <circle cx={50} cy={-8} r={31} fill={WHITE} />
        <circle cx={-50} cy={-8} r={9} fill={DARK} />
        <circle cx={50} cy={-8} r={9} fill={DARK} />
        <rect x={-16} y={42} width={32} height={46} rx={16} fill={DARK} />
      </>
    );
  if (expression === 'sceptical')
    return (
      <>
        <path d="M-78 -6h56a28 16 0 0 1 -56 0z" fill={WHITE} />
        <path d="M22 -22h56a28 28 0 0 1 -56 0z" fill={WHITE} />
        <circle cx={-46} cy={0} r={8} fill={DARK} />
        <circle cx={54} cy={-10} r={11} fill={DARK} />
        <rect x={16} y={-48} width={68} height={13} rx={6} transform="rotate(-10 50 -42)" fill={DARK} />
        <rect x={8} y={52} width={46} height={14} rx={7} fill={DARK} />
      </>
    );
  return (
    <>
      <path d="M-78 -20h56a28 28 0 0 1 -56 0z" fill={WHITE} />
      <path d="M22 -20h56a28 28 0 0 1 -56 0z" fill={WHITE} />
      <circle cx={-50} cy={-8} r={11} fill={DARK} />
      <circle cx={50} cy={-8} r={11} fill={DARK} />
      <rect x={-22} y={50} width={44} height={14} rx={7} fill={DARK} />
    </>
  );
};

const Head: React.FC<PartProps> = ({variant, expression}) => {
  const skin = variant === 0 ? '#ffc531' : '#ff9db5';
  const hair = variant === 0 ? DARK : '#4a1942';
  return (
    <>
      {variant === 1 ? (
        <>
          <rect x={-125} y={-178} width={70} height={72} rx={20} fill={hair} />
          <rect x={55} y={-178} width={70} height={72} rx={20} fill={hair} />
          <rect x={55} y={-178} width={70} height={72} rx={20} fill={SHADE} />
        </>
      ) : null}
      <rect x={-130} y={-115} width={260} height={230} rx={70} fill={skin} />
      <path d={rrHalf(0, -115, 130, 115, 70)} fill={SHADE} />
      {variant === 0 ? (
        <>
          <path d="M-130 -60V-100Q-130 -143 -90 -143H90Q130 -143 130 -100V-60Z" fill={hair} />
          <path d="M0 -60V-143H90Q130 -143 130 -100V-60Z" fill={SHADE} />
        </>
      ) : (
        <>
          <path d="M-130 -70V-90Q-130 -122 -90 -122H90Q130 -122 130 -90V-70Z" fill={hair} />
          <path d="M0 -70V-122H90Q130 -122 130 -90V-70Z" fill={SHADE} />
        </>
      )}
      <Face expression={expression} />
    </>
  );
};

const Arm: React.FC<{readonly d: string; readonly hx: number; readonly hy: number; readonly body: string; readonly skin: string}> = ({d, hx, hy, body, skin}) => (
  <>
    <path d={d} stroke={body} strokeWidth={46} strokeLinecap="round" fill="none" />
    <circle cx={hx} cy={hy} r={27} fill={skin} />
  </>
);

const Character: React.FC<PartProps> = (props) => {
  const body = props.variant === 0 ? '#2747d8' : '#0d8f63';
  const skin = props.variant === 0 ? '#ffc531' : '#ff9db5';
  return (
    <>
      <rect x={-72} y={-70} width={54} height={70} rx={12} fill={DARK} />
      <rect x={18} y={-70} width={54} height={70} rx={12} fill={DARK} />
      <Arm d="M-104 -236 L-150 -140" hx={-154} hy={-128} body={body} skin={skin} />
      {props.variant === 0 ? (
        <Arm d="M104 -236 L170 -306" hx={176} hy={-316} body={body} skin={skin} />
      ) : (
        <Arm d="M104 -236 L150 -140" hx={154} hy={-128} body={body} skin={skin} />
      )}
      <rect x={-110} y={-300} width={220} height={245} rx={44} fill={body} />
      <path d={rrHalf(0, -300, 110, -55, 44)} fill={SHADE} />
      <g transform="translate(0 -405)">
        <Head {...props} />
      </g>
    </>
  );
};

export const stack: Concept = {
  id: 'stack',
  name: 'Stack',
  bgColor: '#ef4b2d',
  idea: 'No outlines at all. Chunky rounded blocks stacked like toy bricks, split down the middle into a light side and a shadow side.',
  specs: [
    ['Height', '2 heads tall, squat and wide'],
    ['Outline', 'None. Shapes are separated by colour only'],
    ['Face', 'Half-moon eyes with a flat lid, a small slot mouth, no nose'],
    ['Colour', 'Each person is two bold colours; skin is never realistic'],
    ['Motion', 'Bouncy and snappy; blocks squash and hop'],
  ],
  palette: ['#ef4b2d', '#2747d8', '#ffc531', '#ff9db5', '#0d8f63', DARK],
  compare: ['None', '2 heads', 'Excellent. Big shapes, big faces', 'Low to medium', 'Closest to familiar flat explainer looks'],
  faceViewBox: '-165 -185 330 330',
  Defs: () => null,
  Head,
  Character,
  Chair: () => (
    <>
      <rect x={-80} y={-340} width={46} height={340} rx={14} fill={DARK} />
      <rect x={58} y={-160} width={40} height={160} rx={14} fill={DARK} />
      <rect x={-80} y={-186} width={180} height={50} rx={16} fill="#ffc531" />
      <path d={rrHalf(10, -186, 100, -136, 16)} fill={SHADE} />
    </>
  ),
  Background: ({width: W, height: H, groundY}) => (
    <>
      <rect width={W} height={H} fill="#ef4b2d" />
      <circle cx={W / 2} cy={groundY - 260} r={Math.min(W, H) * 0.42} fill="#ff6a47" />
      <rect y={groundY - 34} width={W} height={H - groundY + 34} fill="#c93a1f" />
    </>
  ),
};
