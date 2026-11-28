# Open Chair animation engine

Separate Remotion project for the Open Chair channel's animation style. It does not touch the existing production system.

**Status: Phase 1, character concepts only.** No animation system yet; that starts once a concept is approved.

## Commands

```bash
npm install
```

```bash
npm run studio
```

Opens Remotion Studio. Under `Concepts` there is one still per concept in long-form (1920 × 1080) and Shorts (1080 × 1920). Change the expression in the right-hand sidebar.

```bash
npm run gallery
```

Rebuilds `concepts/index.html`, the side-by-side comparison page, from the same components.

## Layout

- `src/concepts/` one file per concept (character, head, chair, background)
- `src/ConceptStage.tsx`, `src/Root.tsx` Remotion stills
- `scripts/build-gallery.tsx`, `concepts/template.html` comparison page generator
- `.agents/skills/` Remotion agent skills (installed with `npx remotion skills add`)
