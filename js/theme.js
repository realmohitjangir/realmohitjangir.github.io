/**
 * theme.js
 * Handles dark/light theme toggling, persistence, and system preference sync.
 */

const STORAGE_KEY = "portfolio-theme";

function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable — degrade silently */
  }
}

function systemPrefersLight() {
  return window.matchMedia("(prefers-color-scheme: light)").matches;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.setAttribute("aria-checked", theme === "light" ? "true" : "false");
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "light" ? "#fafaf7" : "#050505");
  }
}

export function initTheme() {
  const stored = getStoredTheme();
  const initial = stored || (systemPrefersLight() ? "light" : "dark");
  applyTheme(initial);

  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    storeTheme(next);
  });
}
