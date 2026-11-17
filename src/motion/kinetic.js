import { gsap } from 'gsap';
import { DUR, EASE, STAGGER, SCRUB } from './tokens.js';

// Wraps each word of an element in a mask (`.kw`) + inner (`.kw-i`).
// Preserves <br>, <em>, <span> and their classes, so text stays real, selectable and
// read naturally by screen readers. Words, not letters: legibility and performance.
export function splitWords(root) {
  if (!root || root.dataset.split === 'done') return [];
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        if (parts.every((p) => !p.trim())) return;
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (!part.trim()) { frag.append(document.createTextNode(part)); return; }
          const mask = document.createElement('span');
          mask.className = 'kw';
          const inner = document.createElement('span');
          inner.className = 'kw-i';
          inner.textContent = part;
          mask.append(inner);
          frag.append(mask);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(root);
  root.dataset.split = 'done';
  return [...root.querySelectorAll('.kw-i')];
}

// Groups split words into visual lines (by offsetTop) — used for line-based staggers.
export function wordLines(root) {
  const lines = [];
  let top = null;
  root.querySelectorAll('.kw').forEach((w) => {
    if (top === null || Math.abs(w.offsetTop - top) > 4) { lines.push([]); top = w.offsetTop; }
    lines[lines.length - 1].push(w.firstElementChild);
  });
  return lines;
}

const st = (trigger, extra = {}) => ({ trigger, start: 'top 82%', toggleActions: 'play none none reverse', ...extra });

// Reveal variants. Each heading gets a deliberate one; never the same fade everywhere.
export const reveals = {
  // Words rise out of their masks, with a slight skew that settles.
  rise(el) {
    const words = splitWords(el);
    return gsap.from(words, { yPercent: 135, rotate: 4, duration: DUR.slow, ease: EASE.out, stagger: STAGGER.words, scrollTrigger: st(el) });
  },
  // Left-to-right clipping wipe of the whole heading, then the accent word lifts.
  clip(el) {
    const tl = gsap.timeline({ scrollTrigger: st(el) });
    tl.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: DUR.slow, ease: EASE.inOut });
    const em = el.querySelector('em');
    if (em) tl.from(em, { opacity: 0.25, duration: DUR.base, ease: EASE.soft }, '-=0.5');
    return tl;
  },
  // Lines drift in from alternating sides, scrubbed to scroll (kinetic, reversible).
  slide(el) {
    const words = splitWords(el);
    const lines = wordLines(el);
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 40%', scrub: SCRUB.base } });
    lines.forEach((line, i) => tl.from(line, { xPercent: i % 2 ? 22 : -22, opacity: 0, ease: EASE.scroll, duration: 1 }, i * 0.15));
    return words.length ? tl : null;
  },
  // Accent word scales up through the line while the rest rises — weight shift.
  scale(el) {
    const words = splitWords(el);
    const tl = gsap.timeline({ scrollTrigger: st(el) });
    tl.from(words, { yPercent: 135, duration: DUR.slow, ease: EASE.out, stagger: STAGGER.words });
    const em = el.querySelector('em');
    if (em) tl.from(em, { scale: 0.82, opacity: 0.35, transformOrigin: 'left bottom', duration: DUR.slow, ease: EASE.out }, 0.25);
    return tl;
  },
};

export function revealHeadings(scope = document) {
  scope.querySelectorAll('[data-reveal]').forEach((el) => {
    const fn = reveals[el.dataset.reveal];
    if (fn) fn(el);
  });
}

// Letters as individual spans — used sparingly (one word per composition).
export function splitChars(el) {
  if (!el || el.dataset.chars === 'done') return [];
  const text = el.textContent;
  el.textContent = '';
  el.dataset.chars = 'done';
  return [...text].map((ch) => { const s = document.createElement('span'); s.className = 'kc'; s.textContent = ch; el.append(s); return s; });
}

// Typographic parallax: each visual line of a split heading drifts at its own rate.
export function parallaxLines(el, amount = 40, gsapRef, scrub = 1) {
  if (!el) return;
  splitWords(el);
  wordLines(el).forEach((line, i, all) => {
    const k = (i - (all.length - 1) / 2) * amount;
    gsapRef.fromTo(line, { y: k }, { y: -k, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub } });
  });
}
