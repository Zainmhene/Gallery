/**
 * Builds concepts/index.html from the same React components Remotion uses,
 * so the comparison gallery can never drift from the Studio stills.
 * Run: npm run gallery
 */
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {CONCEPTS, EXPRESSIONS} from '../src/concepts';
import {FaceSvg, StageSvg} from '../src/concepts/StageSvg';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FORMATS = {wide: [1920, 1080], tall: [1080, 1920]} as const;

const data = CONCEPTS.map((concept, i) => {
  // Only one stage per concept is in the page at a time, so stages share a uid; faces get their own.
  const stage = (width: number, height: number) =>
    Object.fromEntries(
      EXPRESSIONS.map((expression) => [
        expression,
        renderToStaticMarkup(<StageSvg concept={concept} expression={expression} width={width} height={height} uid={`s${i}`} />),
      ]),
    );
  return {
    name: concept.name,
    idea: concept.idea,
    specs: concept.specs,
    palette: concept.palette,
    compare: concept.compare,
    faces: Object.fromEntries(
      EXPRESSIONS.map((expression, j) => [expression, renderToStaticMarkup(<FaceSvg concept={concept} expression={expression} uid={`f${i}${j}`} />)]),
    ),
    stages: {wide: stage(...FORMATS.wide), tall: stage(...FORMATS.tall)},
  };
});

const template = readFileSync(join(root, 'concepts/template.html'), 'utf8');
const json = JSON.stringify(data).replace(/</g, '\\u003c');
writeFileSync(join(root, 'concepts/index.html'), template.replace('/*__DATA__*/null', () => json));
console.log(`Wrote concepts/index.html (${Math.round(json.length / 1024)} KB of SVG data)`);
