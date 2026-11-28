/**
 * A pose is a flat set of numbers, so any two poses can be blended.
 * Angles are in degrees: 0 hangs straight down, positive swings toward screen-right.
 * The second number of each limb is the bend at the elbow or knee.
 */
export type Pose = {
  x: number;
  y: number;
  lean: number;
  headTilt: number;
  headTurn: number;
  headNod: number;
  lookX: number;
  lookY: number;
  blink: number;
  eyeScale: number;
  smile: number;
  mouthOpen: number;
  browRaise: number;
  browSkew: number;
  armL1: number;
  armL2: number;
  armR1: number;
  armR2: number;
  legL1: number;
  legL2: number;
  legR1: number;
  legR2: number;
  /** 0 = feet turned out (facing camera), 1 = both feet point right (walking) */
  feetSide: number;
};

export const REST: Pose = {
  x: 0, y: 0, lean: 0,
  headTilt: 0, headTurn: 0, headNod: 0,
  lookX: 0, lookY: 0, blink: 0, eyeScale: 1,
  smile: 0, mouthOpen: 0, browRaise: 0, browSkew: 0,
  armL1: -28, armL2: 26, armR1: 28, armR2: -26,
  legL1: 0, legL2: 0, legR1: 0, legR2: 0,
  feetSide: 0,
};

export const pose = (overrides: Partial<Pose>): Pose => ({...REST, ...overrides});

export const mixPose = (a: Pose, b: Pose, t: number): Pose => {
  const out = {...a};
  for (const key of Object.keys(a) as (keyof Pose)[]) {
    out[key] = a[key] + (b[key] - a[key]) * t;
  }
  return out;
};

export const addPose = (base: Pose, delta: Partial<Pose>): Pose => {
  const out = {...base};
  for (const key of Object.keys(delta) as (keyof Pose)[]) {
    out[key] = base[key] + (delta[key] ?? 0);
  }
  return out;
};
