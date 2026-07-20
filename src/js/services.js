import { initNav } from "./nav.js";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  if (window.location.hash) return;

  window.scrollTo({ top: 0, behavior: "auto" });
});

document.addEventListener("DOMContentLoaded", () => {
  initNav();
});
