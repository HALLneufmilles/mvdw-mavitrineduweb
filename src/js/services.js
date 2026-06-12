import { initNav } from "./nav.js";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo({ top: 0, behavior: "auto" });
});

document.addEventListener("DOMContentLoaded", () => {
  initNav();
});
