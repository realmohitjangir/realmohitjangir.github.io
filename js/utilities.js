/**
 * utilities.js
 * Small, dependency-free helper functions shared across modules.
 */

/** Debounce: delay invoking fn until `wait` ms have passed since the last call. */
export function debounce(fn, wait = 150) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

/** Throttle: invoke fn at most once every `limit` ms. */
export function throttle(fn, limit = 100) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/** True if the current device is primarily touch-based (no fine pointer). */
export function isTouchDevice() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/** True if the user has requested reduced motion at the OS level. */
export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Clamp a number between min and max. */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/** Linear interpolation. */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/** Query helper. */
export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/** Query-all helper, returns a real array. */
export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

/** Random float between min and max. */
export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
