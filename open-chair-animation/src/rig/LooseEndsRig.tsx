import React from 'react';
import {earc} from '../concepts/geometry';
import {DrawContext, Line} from '../concepts/LooseEnds';
import type {Pose} from './pose';

const INK = '#1d2440';
const YELLOW = '#ffb92e';
const UPPER_ARM = 74;
const FOREARM = 74;
const THIGH = 110;
const SHIN = 109;
const HIP_Y = -224;
const r1 = (n: number) => Math.round(n * 10) / 10;
const rad = (deg: number) => (deg * Math.PI) / 180;
const step = (from: readonly [number, number], angle: number, length: number): [number, number] => [
  from[0] + Math.sin(rad(angle)) * length,
  from[1] + Math.cos(rad(angle)) * length,
];
const pt = (p: readonly [number, number]) => `${r1(p[0])} ${r1(p[1])}`;

/** Fades flat colour in during the last part of a draw-on. */
const useFillOpacity = () => {
  const drawn = React.useContext(DrawContext);
  return Math.min(1, Math.max(0, (drawn - 0.6) / 0.4));
};

const Arm: React.FC<{readonly shoulder: readonly [number, number]; readonly a1: number; readonly a2: number}> = ({shoulder, a1, a2}) => {
  const elbow = step(shoulder, a1, UPPER_ARM);
  const wrist = step(elbow, a1 + a2, FOREARM);
  const palm = step(wrist, a1 + a2, 16);
  // The hand is an open circle whose gap faces back along the arm.
  const back = (Math.atan2(wrist[1] - palm[1], wrist[0] - palm[0]) * 180) / Math.PI;
  return (
    <>
      <Line d={`M${pt(shoulder)} Q${pt(elbow)} ${pt(wrist)}`} />
      <Line d={earc(palm[0], palm[1], 16, 16, back + 30, back + 330)} />
    </>
  );
};

const legPoints = (hipX: number, a1: number, a2: number) => {
  const hip: [number, number] = [hipX, HIP_Y];
  const knee = step(hip, a1, THIGH);
  const ankle = step(knee, a1 + a2, SHIN);
  return {hip, knee, ankle};
};

const Leg: React.FC<{readonly hipX: number; readonly a1: number; readonly a2: number; readonly toe: number}> = ({hipX, a1, a2, toe}) => {
  const {hip, knee, ankle} = legPoints(hipX, a1, a2);
  return <Line d={`M${pt(hip)} Q${pt(knee)} ${pt(ankle)} L${pt([ankle[0] + toe, ankle[1]])}`} />;
};

const Face: React.FC<{readonly p: Pose}> = ({p}) => {
  const fill = useFillOpacity();
  const tx = p.headTurn * 14;
  const ty = p.headNod * 10;
  const eyeR = 7 * p.eyeScale;
  const eyeY = -12 + ty + p.lookY * 3;
  const browShown = Math.min(1, Math.max(p.browRaise, p.browSkew) * 3);
  const browY = -30 - 8 * p.browRaise + ty;
  const w = 14 + 4 * Math.max(0, p.smile);
  const my = 46 + ty;
  const lift = p.smile * 6;
  return (
    <>
      <circle cx={42 + tx * 0.5} cy={30 + ty * 0.5} r={14} fill={YELLOW} opacity={fill} />
      <g opacity={fill}>
        <ellipse cx={-14 + tx + p.lookX * 4} cy={eyeY} rx={eyeR} ry={eyeR * (1 - 0.9 * p.blink)} fill={INK} />
        <ellipse cx={18 + tx + p.lookX * 4} cy={eyeY} rx={eyeR} ry={eyeR * (1 - 0.9 * p.blink)} fill={INK} />
      </g>
      <g transform={`translate(${r1(tx * 1.2)} ${r1(ty)})`}>
        <Line d="M2 -2 L-6 22 L8 22" w={8} />
      </g>
      {browShown > 0.02 ? (
        <g opacity={browShown} transform={`translate(${r1(tx)} 0)`}>
          <Line d={`M-26 ${r1(browY)} L-8 ${r1(browY - 5 * p.browRaise)}`} w={8} />
          <Line d={`M12 ${r1(browY - 5 * p.browRaise - 14 * p.browSkew)} L30 ${r1(browY - 7 * p.browSkew)}`} w={8} />
        </g>
      ) : null}
      <g transform={`translate(${r1(tx)} 0)`}>
        <Line d={`M${r1(-w + 2)} ${r1(my - lift)} Q2 ${r1(my + p.smile * 16)} ${r1(w + 4)} ${r1(my - lift - p.browSkew * 8)}`} w={8} />
        {p.mouthOpen > 0.05 ? <Line d={`M${r1(-w + 6)} ${r1(my + 5)} Q2 ${r1(my + 5 + p.mouthOpen * 30)} ${r1(w)} ${r1(my + 5)}`} w={8} /> : null}
      </g>
    </>
  );
};

/**
 * Concept 1 host as a puppet: every limb, the head and each facial feature
 * moves independently, driven only by the Pose it is given.
 */
export const LooseEndsRig: React.FC<{readonly pose: Pose; readonly colour?: string}> = ({pose: p, colour = '#ff6b57'}) => {
  const fill = useFillOpacity();
  const left = legPoints(-30, p.legL1, p.legL2);
  const right = legPoints(30, p.legR1, p.legR2);
  // Keep the lower foot planted: this gives walking and squatting their bob for free.
  const groundFix = -5 - Math.max(left.ankle[1], right.ankle[1]);
  const toeL = -38 + 76 * p.feetSide;
  return (
    <g transform={`translate(${r1(p.x)} ${r1(p.y + groundFix)})`}>
      <Leg hipX={-30} a1={p.legL1} a2={p.legL2} toe={toeL} />
      <Leg hipX={30} a1={p.legR1} a2={p.legR2} toe={38} />
      <g transform={`rotate(${r1(p.lean)} 0 ${HIP_Y})`}>
        <rect x={-54} y={-446} width={140} height={232} rx={28} fill={colour} opacity={fill} />
        <Line d="M-70 -226 V-430 Q-70 -458 -42 -458 H42 Q70 -458 70 -430 V-226 H18" />
        <Line d="M0 -478 V-460" />
        <Arm shoulder={[-70, -418]} a1={p.armL1} a2={p.armL2} />
        <Arm shoulder={[70, -418]} a1={p.armR1} a2={p.armR2} />
        <g transform={`translate(0 ${r1(-560 + p.headNod * 3)}) rotate(${r1(p.headTilt)} 0 82)`}>
          <ellipse cx={16} cy={12} rx={62} ry={82} fill="#fff" opacity={fill} />
          <Line d={earc(0, 0, 62, 82, 140, 465)} />
          <Line d="M-30 -72 C-28 -124 36 -122 26 -86 C20 -66 -6 -78 4 -98" />
          <Face p={p} />
        </g>
      </g>
    </g>
  );
};
