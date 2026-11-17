// Shared, mutable motion state. DOM timelines (GSAP) write here; WebGL scenes read
// every frame. Keeps scroll choreography in one place without coupling modules.
export const bus = {
  pointer: { x: 0, y: 0 }, // normalised -0.5..0.5, updated once globally
  hero: { intro: 0, rotX: 0, rotY: 0, x: 0, camZ: 0, glow: 0 },
  product: { spin: 0, path: 0, travel: 0, rings: 0 },
  orbital: { x: 0, y: 0, rotX: 0, rotY: 0, scale: 1, spin: 0 },
  services: { active: 0, progress: 0 },
  cta: { proximity: 0, press: 0 },
};

let pointerBound = false;
export function bindPointer() {
  if (pointerBound) return () => {};
  pointerBound = true;
  const move = (e) => {
    bus.pointer.x = e.clientX / window.innerWidth - 0.5;
    bus.pointer.y = e.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener('pointermove', move, { passive: true });
  return () => {
    window.removeEventListener('pointermove', move);
    pointerBound = false;
  };
}
