/**
 * stars.js
 * Renders a calm, minimal star field on a full-viewport canvas with
 * faint neural-network-style connections between nearby stars and a
 * subtle parallax response to pointer movement. Reduces particle count
 * on small screens and respects prefers-reduced-motion.
 */

import { clamp, prefersReducedMotion, randomRange } from "./utilities.js";

const CONNECT_DISTANCE = 120;
const MAX_PARALLAX = 10;

export function initStars() {
  const canvas = document.getElementById("stars-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = prefersReducedMotion();

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars = [];
  let pointer = { x: 0, y: 0, active: false };
  let rafId = null;

  function starCountFor(w) {
    if (w < 480) return 55;
    if (w < 768) return 80;
    if (w < 1280) return 120;
    return 160;
  }

  function isLight() {
    return document.documentElement.getAttribute("data-theme") === "light";
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function buildStars() {
    const count = starCountFor(width);
    stars = Array.from({ length: count }, () => ({
      x: randomRange(0, width),
      y: randomRange(0, height),
      radius: randomRange(0.5, 1.6),
      baseAlpha: randomRange(0.25, 0.9),
      twinkleSpeed: randomRange(0.4, 1.2),
      twinklePhase: randomRange(0, Math.PI * 2),
      depth: randomRange(0.2, 1),
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const light = isLight();
    const starColor = light ? "17, 17, 17" : "255, 255, 255";
    const lineColor = light ? "37, 99, 235" : "59, 130, 246";

    const parallaxX = pointer.active ? (pointer.x / width - 0.5) * MAX_PARALLAX : 0;
    const parallaxY = pointer.active ? (pointer.y / height - 0.5) * MAX_PARALLAX : 0;

    // Draw faint neural connections first (behind stars)
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const a = stars[i];
        const b = stars[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DISTANCE) {
          const opacity = (1 - dist / CONNECT_DISTANCE) * 0.08;
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x + parallaxX * a.depth, a.y + parallaxY * a.depth);
          ctx.lineTo(b.x + parallaxX * b.depth, b.y + parallaxY * b.depth);
          ctx.stroke();
        }
      }
    }

    // Draw stars
    stars.forEach((star) => {
      const twinkle = reduceMotion
        ? star.baseAlpha
        : star.baseAlpha * (0.6 + 0.4 * Math.sin(time * 0.001 * star.twinkleSpeed + star.twinklePhase));
      ctx.beginPath();
      ctx.fillStyle = `rgba(${starColor}, ${clamp(twinkle, 0, 1)})`;
      ctx.arc(
        star.x + parallaxX * star.depth,
        star.y + parallaxY * star.depth,
        star.radius,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    if (!reduceMotion) {
      rafId = requestAnimationFrame(draw);
    }
  }

  function handlePointerMove(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  }

  function handleResize() {
    cancelAnimationFrame(rafId);
    resize();
    rafId = requestAnimationFrame(draw);
  }

  resize();
  draw(0);

  if (!reduceMotion) {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
  }
  window.addEventListener("resize", handleResize, { passive: true });
}
