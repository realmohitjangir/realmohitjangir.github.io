/**
 * loader.js
 * Hides the full-page loader once critical content and fonts are ready.
 */

export function initLoader() {
  const loader = document.querySelector(".loader");
  if (!loader) return;

  document.body.classList.add("no-scroll");

  const hide = () => {
    loader.classList.add("is-hidden");
    document.body.classList.remove("no-scroll");
    loader.addEventListener(
      "transitionend",
      () => {
        loader.remove();
      },
      { once: true }
    );
  };

  const ready = new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      window.addEventListener("load", resolve, { once: true });
    }
  });

  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();

  // Minimum display time keeps the loader from flashing on fast connections.
  const minDelay = new Promise((resolve) => setTimeout(resolve, 500));

  Promise.all([ready, fonts, minDelay]).then(hide);
}
