/**
 * main.js
 * Application entry point — imported as a module from index.html.
 * Wires together every feature module once the DOM is ready.
 */

import { initLoader } from "./loader.js";
import { initTheme } from "./theme.js";
import { initNavbar } from "./navbar.js";
import { initStars } from "./stars.js";
import { initCursor } from "./cursor.js";
import { initTyping } from "./typing.js";
import { initScrollReveal, initImageReveal } from "./animation.js";

function init() {
  initTheme();
  initLoader();
  initNavbar();
  initStars();
  initCursor();
  initTyping();
  initScrollReveal();
  initImageReveal();

  // Current year in footer
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
