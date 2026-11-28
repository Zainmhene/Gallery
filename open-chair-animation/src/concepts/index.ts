import {looseEnds} from './LooseEnds';
import {pebble} from './Pebble';
import {pinnedPaper} from './PinnedPaper';
import {stack} from './Stack';
import {twoInk} from './TwoInk';
import type {Concept} from './types';

export const CONCEPTS: readonly Concept[] = [looseEnds, stack, pinnedPaper, twoInk, pebble];
export const CONCEPT_IDS = ['loose-ends', 'stack', 'pinned-paper', 'two-ink', 'pebble'] as const;
export type ConceptId = (typeof CONCEPT_IDS)[number];

export const getConcept = (id: string): Concept => {
  const concept = CONCEPTS.find((c) => c.id === id);
  if (!concept) throw new Error(`Unknown concept: ${id}`);
  return concept;
};

export * from './types';
