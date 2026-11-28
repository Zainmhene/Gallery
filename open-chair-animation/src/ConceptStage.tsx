import React, {useId} from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {z} from 'zod';
import {CONCEPT_IDS, EXPRESSIONS, getConcept} from './concepts';
import {StageSvg} from './concepts/StageSvg';

export const conceptStageSchema = z.object({
  concept: z.enum(CONCEPT_IDS),
  expression: z.enum(EXPRESSIONS),
});

/** Phase 1 preview: one character concept on its stage, sized by the composition. */
export const ConceptStage: React.FC<z.infer<typeof conceptStageSchema>> = ({concept, expression}) => {
  const {width, height} = useVideoConfig();
  const uid = `oc${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <AbsoluteFill>
      <StageSvg concept={getConcept(concept)} expression={expression} width={width} height={height} uid={uid} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};
