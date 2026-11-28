import React from 'react';
import type {Concept, Expression} from './types';

type StageSvgProps = {
  readonly concept: Concept;
  readonly expression: Expression;
  readonly width: number;
  readonly height: number;
  readonly uid: string;
  readonly style?: React.CSSProperties;
};

/**
 * Host, empty chair and (in landscape) a guest, standing on the concept's own
 * background. Pure SVG with no Remotion hooks, so the same markup is used by
 * Remotion Studio and by the HTML comparison gallery.
 */
export const StageSvg: React.FC<StageSvgProps> = ({concept, expression, width, height, uid, style}) => {
  const wide = width > height;
  const groundY = Math.round(height * (wide ? 0.86 : 0.8));
  const scale = wide ? 1.15 : 1.5;
  const place = (x: number) => `translate(${x} ${groundY}) scale(${scale})`;
  const {Defs, Background, Character, Chair} = concept;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${concept.name}: host, empty chair${wide ? ' and guest' : ''}`}
      style={style}
    >
      <defs>
        <Defs uid={uid} />
      </defs>
      <Background width={width} height={height} groundY={groundY} uid={uid} />
      <g transform={place(wide ? 540 : 370)}>
        <Character variant={0} expression={expression} uid={uid} />
      </g>
      <g transform={place(wide ? 980 : 810)}>
        <Chair uid={uid} />
      </g>
      {wide ? (
        <g transform={place(1400)}>
          <Character variant={1} expression="happy" uid={uid} />
        </g>
      ) : null}
    </svg>
  );
};

export const FaceSvg: React.FC<{readonly concept: Concept; readonly expression: Expression; readonly uid: string}> = ({concept, expression, uid}) => {
  const [x, y, w, h] = concept.faceViewBox.split(' ').map(Number);
  const {Defs, Head} = concept;
  return (
    <svg viewBox={concept.faceViewBox} role="img" aria-label={`${concept.name} ${expression} face`}>
      <defs>
        <Defs uid={uid} />
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={concept.bgColor} />
      <Head variant={0} expression={expression} uid={uid} />
    </svg>
  );
};
