/**
 * typing.js
 * Minimal typewriter effect cycling through a list of roles in the hero.
 * Respects prefers-reduced-motion by displaying the first role statically.
 */

import { prefersReducedMotion } from "./utilities.js";

const ROLES = ["Machine Learning Engineer", "AI Developer", "Computer Vision Enthusiast"];
const TYPE_SPEED = 55;
const DELETE_SPEED = 30;
const HOLD_TIME = 1800;

export function initTyping() {
  const el = document.querySelector("[data-typing]");
  if (!el) return;

  if (prefersReducedMotion()) {
    el.textContent = ROLES[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = ROLES[roleIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, HOLD_TIME);
      }
      return setTimeout(tick, TYPE_SPEED);
    }

    charIndex--;
    el.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % ROLES.length;
      return setTimeout(tick, TYPE_SPEED);
    }
    return setTimeout(tick, DELETE_SPEED);
  }

  tick();
}
