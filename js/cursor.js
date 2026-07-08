/**
 * cursor.js
 * Soft spotlight that follows the pointer, plus a subtle "magnetic"
 * pull for primary buttons. Fully disabled on touch devices.
 */

import { isTouchDevice, lerp, qsa } from "./utilities.js";

export function initCursor() {
  if (isTouchDevice()) return;

  const glow = document.querySelector(".cursor-glow");
  if (glow) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener(
      "pointermove",
      (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        glow.classList.add("is-active");
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () => glow.classList.remove("is-active"));

    function animate() {
      currentX = lerp(currentX, targetX, 0.15);
      currentY = lerp(currentY, targetY, 0.15);
      glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  /* ---- Magnetic buttons ---- */
  const magnetic = qsa(".btn-primary, .theme-toggle");
  magnetic.forEach((el) => {
    el.classList.add("magnetic");

    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.3}px)`;
    });

    el.addEventListener("pointerleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });
}
