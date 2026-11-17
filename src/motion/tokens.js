// GX Motion System — single source of truth for timing and easing.
// Mirrors the CSS custom properties declared in src/motion.css (:root --dur-*, --ease-*).
// Categories (see docs/14-MOTION-DESIGN-EXPERIENCE.md):
//   ambient     — continuous, subtle, never competes with content
//   interaction — hover / focus / press feedback (fast, responsive)
//   scroll      — scrubbed to scroll position (ease:none, smoothing via scrub)
//   transition  — connects sections and states
//   cinematic   — high-impact sequences (intro, pinned stories)

export const DUR = {
  micro: 0.2, // interaction feedback (hover 150–300 ms)
  fast: 0.35, // small reveals, icon morphs, card swaps
  base: 0.6, // standard reveals (400–800 ms)
  slow: 0.8, // headline / object entrances
  cinematic: 1.2, // intro + hero object (600–1200 ms)
};

export const EASE = {
  out: 'expo.out', // reveals: fast start, long settle
  soft: 'power3.out', // secondary elements
  inOut: 'power3.inOut', // state changes, transitions
  snap: 'back.out(1.7)', // small pops (dots, nodes)
  scroll: 'none', // scrubbed timelines
};

export const STAGGER = { words: 0.055, lines: 0.1, cards: 0.09, nodes: 0.04 };

// Scrub smoothing per intent: lower = tighter coupling to the scroll bar.
export const SCRUB = { tight: 0.3, base: 0.5, soft: 0.8 }; // 6.0: less lag between wheel and motion

// Intro choreography (seconds). Reference values from the brief, refined visually.
export const INTRO = {
  background: [0, 0.5],
  graphics: [0.45, 1.2],
  object: [0.7, 1.9],
  headline: [1.05, 2.15],
  secondary: [1.7, 2.5],
};
