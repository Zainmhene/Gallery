import React from 'react';
import {Composition, Folder, Still} from 'remotion';
import {ConceptStage, conceptStageSchema} from './ConceptStage';
import {Showcase} from './showcase/Showcase';

/**
 * Phase 1: character concepts only. Each concept has a long-form (1920x1080)
 * and a Shorts (1080x1920) still. Change the expression in the Studio sidebar.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Folder name="Motion-tests">
      <Composition id="Showcase-Wide" component={Showcase} durationInFrames={1200} fps={30} width={1920} height={1080} />
      <Composition id="Showcase-Shorts" component={Showcase} durationInFrames={1200} fps={30} width={1080} height={1920} />
    </Folder>
    <Folder name="Concepts">
      <Folder name="Long-form">
        <Still id="LooseEnds-Wide" component={ConceptStage} schema={conceptStageSchema} width={1920} height={1080} defaultProps={{concept: 'loose-ends', expression: 'neutral'}} />
        <Still id="Stack-Wide" component={ConceptStage} schema={conceptStageSchema} width={1920} height={1080} defaultProps={{concept: 'stack', expression: 'neutral'}} />
        <Still id="PinnedPaper-Wide" component={ConceptStage} schema={conceptStageSchema} width={1920} height={1080} defaultProps={{concept: 'pinned-paper', expression: 'neutral'}} />
        <Still id="TwoInk-Wide" component={ConceptStage} schema={conceptStageSchema} width={1920} height={1080} defaultProps={{concept: 'two-ink', expression: 'neutral'}} />
        <Still id="Pebble-Wide" component={ConceptStage} schema={conceptStageSchema} width={1920} height={1080} defaultProps={{concept: 'pebble', expression: 'neutral'}} />
      </Folder>
      <Folder name="Shorts">
        <Still id="LooseEnds-Shorts" component={ConceptStage} schema={conceptStageSchema} width={1080} height={1920} defaultProps={{concept: 'loose-ends', expression: 'neutral'}} />
        <Still id="Stack-Shorts" component={ConceptStage} schema={conceptStageSchema} width={1080} height={1920} defaultProps={{concept: 'stack', expression: 'neutral'}} />
        <Still id="PinnedPaper-Shorts" component={ConceptStage} schema={conceptStageSchema} width={1080} height={1920} defaultProps={{concept: 'pinned-paper', expression: 'neutral'}} />
        <Still id="TwoInk-Shorts" component={ConceptStage} schema={conceptStageSchema} width={1080} height={1920} defaultProps={{concept: 'two-ink', expression: 'neutral'}} />
        <Still id="Pebble-Shorts" component={ConceptStage} schema={conceptStageSchema} width={1080} height={1920} defaultProps={{concept: 'pebble', expression: 'neutral'}} />
      </Folder>
    </Folder>
    </>
  );
};
