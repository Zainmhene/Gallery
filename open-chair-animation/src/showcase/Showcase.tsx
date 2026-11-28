import React from 'react';
import {AbsoluteFill, Easing, interpolate, Series, useCurrentFrame, useVideoConfig} from 'remotion';
import {DrawContext, looseEnds} from '../concepts/LooseEnds';
import {ANIMATIONS, type AnimationName} from '../rig/animations';
import {LooseEndsRig} from '../rig/LooseEndsRig';

const INK = '#1d2440';

/** The stage, chair and performer. Subscribes to the frame because the pose changes every frame. */
const Performer: React.FC<{readonly animation: AnimationName; readonly drawOn?: boolean}> = ({animation, drawOn = false}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const wide = width > height;
  const groundY = Math.round(height * (wide ? 0.86 : 0.8));
  const scale = wide ? 1.15 : 1.5;
  const centred = animation === 'walk';
  const actorX = centred ? width / 2 : wide ? 700 : 380;
  const {Background, Chair} = looseEnds;
  return (
    <DrawContext.Provider value={drawOn ? interpolate(frame, [0, 2 * fps], [0, 1], {extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1)}) : 1}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{width: '100%', height: '100%'}}>
        <Background width={width} height={height} groundY={groundY} uid="showcase" />
        {centred ? null : (
          <g transform={`translate(${wide ? 1220 : 820} ${groundY}) scale(${scale})`}>
            <Chair uid="showcase" />
          </g>
        )}
        <g transform={`translate(${actorX} ${groundY}) scale(${scale})`}>
          <LooseEndsRig pose={ANIMATIONS[animation](frame, fps)} />
        </g>
      </svg>
    </DrawContext.Provider>
  );
};

const PushIn: React.FC<{readonly children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        transformOrigin: width > height ? '36% 30%' : '35% 38%',
        scale: interpolate(frame, [0.3 * fps, 2.2 * fps], [1, 2.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1)}),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Pan: React.FC<{readonly children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        scale: 1.5,
        translate: interpolate(frame, [0.2 * fps, 2.8 * fps], ['20% 8%', '-20% 8%'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1)}),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Label: React.FC<{readonly group: string; readonly children: React.ReactNode}> = ({group, children}) => {
  const {width, height} = useVideoConfig();
  const wide = width > height;
  return (
    <AbsoluteFill
      style={{
        padding: wide ? '70px 100px' : '0 80px 150px',
        alignItems: wide ? 'flex-end' : 'flex-start',
        justifyContent: wide ? 'flex-start' : 'flex-end',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        color: INK,
      }}
    >
      <div style={{fontSize: wide ? 40 : 44, letterSpacing: 6, textTransform: 'uppercase', opacity: 0.6}}>{group}</div>
      <div style={{fontSize: wide ? 84 : 104, fontWeight: 700, lineHeight: 1.05}}>{children}</div>
    </AbsoluteFill>
  );
};

/** Motion test: every animation the Concept 1 rig can currently perform, 3 to 4 seconds each. */
export const Showcase: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: looseEnds.bgColor}}>
      <Series>
        <Series.Sequence name="Draw on" durationInFrames={3 * fps}>
          <Performer animation="idle" drawOn />
          <Label group="Entrance">Draw on</Label>
        </Series.Sequence>
        <Series.Sequence name="Idle and blink" durationInFrames={3 * fps}>
          <Performer animation="idle" />
          <Label group="Face">Idle and blink</Label>
        </Series.Sequence>
        <Series.Sequence name="Talking" durationInFrames={3 * fps}>
          <Performer animation="talk" />
          <Label group="Face">Talking</Label>
        </Series.Sequence>
        <Series.Sequence name="Expressions" durationInFrames={4 * fps}>
          <Performer animation="expressions" />
          <Label group="Face">Expressions</Label>
        </Series.Sequence>
        <Series.Sequence name="Nod and shake" durationInFrames={3 * fps}>
          <Performer animation="nodAndShake" />
          <Label group="Gesture">Nod, then shake</Label>
        </Series.Sequence>
        <Series.Sequence name="Wave" durationInFrames={3 * fps}>
          <Performer animation="waveHello" />
          <Label group="Gesture">Wave</Label>
        </Series.Sequence>
        <Series.Sequence name="Point" durationInFrames={3 * fps}>
          <Performer animation="point" />
          <Label group="Gesture">Point</Label>
        </Series.Sequence>
        <Series.Sequence name="Shrug" durationInFrames={3 * fps}>
          <Performer animation="shrug" />
          <Label group="Gesture">Shrug</Label>
        </Series.Sequence>
        <Series.Sequence name="Think" durationInFrames={3 * fps}>
          <Performer animation="think" />
          <Label group="Gesture">Think</Label>
        </Series.Sequence>
        <Series.Sequence name="Walk" durationInFrames={3 * fps}>
          <Performer animation="walk" />
          <Label group="Body">Walk cycle</Label>
        </Series.Sequence>
        <Series.Sequence name="Jump" durationInFrames={3 * fps}>
          <Performer animation="jump" />
          <Label group="Body">Jump</Label>
        </Series.Sequence>
        <Series.Sequence name="Camera push-in" durationInFrames={3 * fps}>
          <PushIn>
            <Performer animation="talk" />
          </PushIn>
          <Label group="Camera">Push in</Label>
        </Series.Sequence>
        <Series.Sequence name="Camera pan" durationInFrames={3 * fps}>
          <Pan>
            <Performer animation="idle" />
          </Pan>
          <Label group="Camera">Pan</Label>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
