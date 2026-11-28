import {Easing, interpolate, random} from 'remotion';
import {addPose, mixPose, pose, REST, type Pose} from './pose';

/** Every animation is a pure function of the frame number: same frame, same pose, every render. */
export type Animation = (frame: number, fps: number) => Pose;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const smooth = Easing.bezier(0.4, 0, 0.2, 1);
const wave = (frame: number, fps: number, perSecond: number, offset = 0) => Math.sin((frame / fps) * perSecond * Math.PI * 2 + offset);

/** A quick blink roughly every 2.4 seconds. Returns 0 (open) to 1 (shut). */
export const blink = (frame: number, fps: number, every = 2.4): number => {
  const t = (frame + fps * 0.9) % Math.round(every * fps);
  return interpolate(t, [0, 2, 4, 7], [0, 1, 1, 0], clamp);
};

/** Breathing, a little arm sway and blinking. Layered under most other animations. */
const alive = (frame: number, fps: number): Partial<Pose> => ({
  y: wave(frame, fps, 0.4) * 2,
  armL1: wave(frame, fps, 0.4) * 2,
  armR1: -wave(frame, fps, 0.4) * 2,
  blink: blink(frame, fps),
});

/** Ease from rest into a pose over the first 0.4s and back out over the last 0.4s of a clip of `seconds`. */
const inOut = (frame: number, fps: number, seconds: number) =>
  interpolate(frame, [0, 0.4 * fps, (seconds - 0.4) * fps, seconds * fps], [0, 1, 1, 0], {...clamp, easing: smooth});

export const idle: Animation = (f, fps) => addPose(REST, alive(f, fps));

export const talk: Animation = (f, fps) => {
  // Mouth shapes held for 3 frames each, like hand-drawn dialogue.
  const beat = Math.floor(f / 3);
  const open = random(`talk-${beat}`) > 0.25 ? 0.25 + random(`open-${beat}`) * 0.75 : 0;
  return addPose(pose({mouthOpen: open, smile: 0.2, armL1: -40, armL2: -95 + wave(f, fps, 1.3) * 14}), {
    ...alive(f, fps),
    headTilt: wave(f, fps, 0.9) * 3,
    headNod: wave(f, fps, 1.8) * 0.25,
  });
};

const FACES: readonly Pose[] = [
  REST,
  pose({smile: 1, mouthOpen: 0.5, headTilt: 5}),
  pose({mouthOpen: 1, browRaise: 1, eyeScale: 1.3, armL1: -45, armR1: 45, y: -6}),
  pose({smile: -0.3, browSkew: 1, headTilt: -6, lookX: 1}),
];
/** Neutral, happy, surprised, sceptical: one second each. */
export const expressions: Animation = (f, fps) => {
  const index = Math.min(FACES.length - 1, Math.floor(f / fps));
  const previous = FACES[Math.max(0, index - 1)];
  const t = interpolate(f - index * fps, [0, 0.2 * fps], [0, 1], {...clamp, easing: smooth});
  return addPose(mixPose(previous, FACES[index], t), {blink: blink(f, fps)});
};

/** Nods "yes" for the first half, shakes "no" for the second. */
export const nodAndShake: Animation = (f, fps) => {
  const half = 1.5 * fps;
  const nod = f < half ? Math.max(0, wave(f, fps, 2)) : 0;
  const shake = f >= half ? wave(f - half, fps, 2.2) : 0;
  return addPose(pose({headNod: nod, smile: f < half ? 0.6 : -0.3, headTurn: shake, lookX: shake}), alive(f, fps));
};

export const waveHello: Animation = (f, fps) => {
  const t = inOut(f, fps, 3);
  const target = pose({armR1: 118, armR2: 48 + wave(f, fps, 2.4) * 26, smile: 1, headTilt: 5});
  return addPose(mixPose(REST, target, t), alive(f, fps));
};

export const point: Animation = (f, fps) => {
  const t = inOut(f, fps, 3);
  const target = pose({armR1: 100, armR2: 4, lookX: 1, headTurn: 0.7, lean: 3, browRaise: 0.4});
  return addPose(mixPose(REST, target, t), alive(f, fps));
};

export const shrug: Animation = (f, fps) => {
  const t = interpolate(f, [0.3 * fps, 0.7 * fps, 2 * fps, 2.5 * fps], [0, 1, 1, 0], {...clamp, easing: smooth});
  const target = pose({armL1: -55, armL2: -80, armR1: 55, armR2: 80, y: -10, headTilt: 9, browRaise: 0.8, smile: -0.2});
  return addPose(mixPose(REST, target, t), alive(f, fps));
};

export const think: Animation = (f, fps) => {
  const t = inOut(f, fps, 3);
  const target = pose({armR1: 35, armR2: 165, headTilt: 7, lookX: -1, lookY: -1, browSkew: 0.7, smile: -0.2});
  return addPose(mixPose(REST, target, t), {blink: blink(f, fps)});
};

/** One stride per second, crossing the frame from left to right. */
export const walk: Animation = (f, fps) => {
  const phase = (f / fps) * Math.PI * 2;
  const swing = Math.sin(phase);
  return pose({
    x: interpolate(f, [0, 3 * fps], [-580, 580]),
    lean: 4,
    feetSide: 1,
    headTurn: 0.6,
    lookX: 1,
    smile: 0.4,
    legL1: 26 * swing,
    legR1: -26 * swing,
    legL2: -40 * Math.max(0, Math.cos(phase)),
    legR2: -40 * Math.max(0, -Math.cos(phase)),
    armL1: -6 - 24 * swing,
    armL2: 18,
    armR1: 6 + 24 * swing,
    armR2: 18,
    blink: blink(f, fps),
  });
};

export const jump: Animation = (f, fps) => {
  const s = f / fps;
  const squat = interpolate(s, [0.3, 0.7, 0.85, 1.65, 1.8, 2.2], [0, 1, 0, 0, 0.8, 0], {...clamp, easing: smooth});
  const air = interpolate(s, [0.85, 1.65], [0, 1], clamp);
  const height = Math.sin(air * Math.PI) * 240;
  const armsUp = interpolate(s, [0.7, 0.95, 1.6, 1.9], [0, 1, 1, 0], {...clamp, easing: smooth});
  return pose({
    y: -height,
    legL1: -30 * squat,
    legL2: 60 * squat,
    legR1: 30 * squat,
    legR2: -60 * squat,
    armL1: -28 + 40 * squat - 120 * armsUp,
    armR1: 28 - 40 * squat + 120 * armsUp,
    mouthOpen: armsUp,
    smile: armsUp,
    browRaise: armsUp * 0.6,
    blink: blink(f, fps),
  });
};

export const ANIMATIONS = {idle, talk, expressions, nodAndShake, waveHello, point, shrug, think, walk, jump} as const;
export type AnimationName = keyof typeof ANIMATIONS;
