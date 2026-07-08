/**
 * animation.js
 * IntersectionObserver-driven scroll reveals. Adds `.is-visible` once
 * an element enters the viewport; never re-hides on scroll-out to avoid
 * jarring re-triggers.
 */

import { qsa, prefersReducedMotion } from "./utilities.js";

export function initScrollReveal() {
  const targets = qsa(".reveal, .timeline-item, .card, .value-card, .cert-card");

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el, i) => {
    el.style.setProperty("--stagger-index", i % 6);
    observer.observe(el);
  });
}

/** Fades images in once they've finished loading (lazy-load reveal). */
export function initImageReveal() {
  const images = qsa("img[loading='lazy']");
  images.forEach((img) => {
    img.classList.add("img-reveal");
    if (img.complete) {
      img.classList.add("is-loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    }
  });
}
