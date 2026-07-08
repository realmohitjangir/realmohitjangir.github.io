/**
 * navbar.js
 * Scroll progress bar, active-section highlighting, and mobile menu toggle.
 */

import { qs, qsa, throttle } from "./utilities.js";

export function initNavbar() {
  const progress = qs(".scroll-progress");
  const navLinks = qsa(".nav-link");
  const sections = qsa("main section[id]");
  const toggle = qs(".nav-toggle");
  const mobileMenu = qs(".mobile-menu");

  /* ---- Scroll progress bar ---- */
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;
  };

  /* ---- Active link on scroll (IntersectionObserver) ---- */
  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  window.addEventListener("scroll", throttle(updateProgress, 50), { passive: true });
  updateProgress();

  /* ---- Mobile menu ---- */
  if (toggle && mobileMenu) {
    const closeMenu = () => {
      toggle.classList.remove("is-open");
      mobileMenu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    };

    const openMenu = () => {
      toggle.classList.add("is-open");
      mobileMenu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
    };

    toggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    qsa(".nav-link", mobileMenu).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---- Smooth scroll for in-page links ---- */
  qsa('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", `#${targetId}`);
      }
    });
  });
}
