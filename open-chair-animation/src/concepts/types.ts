import type React from 'react';

export const EXPRESSIONS = ['neutral', 'happy', 'surprised', 'sceptical'] as const;
export type Expression = (typeof EXPRESSIONS)[number];

/** variant 0 = host, variant 1 = guest. uid namespaces SVG ids (gradients, filters, clips). */
export type PartProps = {
  readonly variant: 0 | 1;
  readonly expression: Expression;
  readonly uid: string;
};
export type UidProps = {readonly uid: string};
export type BackgroundProps = {
  readonly width: number;
  readonly height: number;
  readonly groundY: number;
  readonly uid: string;
};

/**
 * One visual direction. Characters are drawn with the origin at the feet
 * (0,0), y pointing up into negative numbers. Heads are drawn around (0,0).
 */
export type Concept = {
  readonly id: string;
  readonly name: string;
  readonly bgColor: string;
  readonly idea: string;
  readonly specs: readonly (readonly [string, string])[];
  readonly palette: readonly string[];
  /** Outline, height, reads small, rigging effort, main risk */
  readonly compare: readonly string[];
  readonly faceViewBox: string;
  readonly Defs: React.FC<UidProps>;
  readonly Head: React.FC<PartProps>;
  readonly Character: React.FC<PartProps>;
  readonly Chair: React.FC<UidProps>;
  readonly Background: React.FC<BackgroundProps>;
};
