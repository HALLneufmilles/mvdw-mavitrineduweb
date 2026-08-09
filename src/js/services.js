import { initNav } from "./nav.js";

document.documentElement.classList.add("services-reveal-ready");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  if (window.location.hash) return;

  window.scrollTo({ top: 0, behavior: "auto" });
});

function initServicesReveal() {
  const selectors = [
    ".services-intro-content",
    ".services-intro-grid > article",
    ".site-vitrine-evolution-heading",
    ".site-vitrine-evolution-grid > article",
    ".services-list .section-heading",
    ".services-grid > article",
    ".services-audience .section-heading",
    ".services-audience-list > li",
    ".services-process .section-heading",
    ".process-grid > article",
    ".services-quality .section-heading",
    ".services-quality-intro",
    ".services-quality > .services-quality-list > li",
    ".services-project-cta",
  ];
  const items = document.querySelectorAll(selectors.join(","));
  const firstSectionTitle = document.querySelector(".section-heading--first h2");

  if (firstSectionTitle) {
    firstSectionTitle.classList.add("services-reveal");

    const revealFirstSectionTitle = () => {
      firstSectionTitle.classList.add("is-visible");
    };

    if (window.scrollY > 0) {
      revealFirstSectionTitle();
    } else {
      window.addEventListener("scroll", revealFirstSectionTitle, {
        once: true,
        passive: true,
      });
    }
  }

  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -4% 0px",
      threshold: 0.01,
    },
  );

  items.forEach((item) => {
    item.classList.add("services-reveal");
    observer.observe(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initServicesReveal();
});
