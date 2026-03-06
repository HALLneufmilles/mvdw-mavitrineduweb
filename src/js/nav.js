export function initNav() {
  // nav-bar
  const navbar = document.querySelector(".nav-barre");
  const togglebtn = document.querySelector(".toggle-btn");
  const overlay = document.querySelector("#overlay-menu");
  const links = document.querySelectorAll(".links, .footer-links");

  // ✅ Guard : si le menu n'existe pas sur la page, on quitte sans erreur
  if (!navbar || !togglebtn || !overlay) return;

  // Ferme le menu et libère la page.
  function closeMenu() {
    navbar.classList.remove("active");
    togglebtn.classList.remove("active");
    overlay.classList.remove("active");
    document.documentElement.classList.remove("no-scroll");
  }

  // Ajout de la classe selec pour que les lien garde l'apparence actif.
  function setSelectedLink(clickedLink) {
    // retire .selec partout dans la nav (et éventuellement footer si tu veux)
    document
      .querySelectorAll(".nav-container-links .links.selec")
      .forEach((a) => {
        a.classList.remove("selec");
      });

    // ajoute sur le lien cliqué (si c’est bien un lien du menu)
    if (clickedLink.classList.contains("links")) {
      clickedLink.classList.add("selec");
    }
  }

  // --- Scroll animé
  function smoothScrollTo(targetElement) {
    const start = window.scrollY;
    const targetPosition = targetElement.getBoundingClientRect().top + start;
    const distance = targetPosition - start;
    const limitedTime = 2000;
    let startTime = null;

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / limitedTime, 1);
      const easeProgress = easeInOutQuad(progress);
      const newY = start + distance * easeProgress;

      window.scrollTo(0, newY);

      if (timeElapsed < limitedTime) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
  }

  // ---------------------------------------------

  togglebtn.addEventListener("click", () => {
    const isMenuOpen = navbar.classList.toggle("active");
    togglebtn.classList.toggle("active");
    overlay.classList.toggle("active");

    document.documentElement.classList.toggle("no-scroll", isMenuOpen);
  });

  // On intercepte tous les clics sur .links, .footer-links.
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hrefAttr = link.getAttribute("href") || "";
      const isHashLink = hrefAttr.startsWith("#");

      // ✅ si ancre, on sélectionne le lien
      if (isHashLink) setSelectedLink(link);

      // Toujours fermer le menu (UX)
      // closeMenu();

      // Si ce n’est pas une ancre, on laisse le navigateur gérer
      if (!isHashLink) return;

      event.preventDefault();

      const targetId = hrefAttr.slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) smoothScrollTo(targetElement);
    });
  });

  // Fermer le menu si on clique en dehors
  document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target) && !togglebtn.contains(event.target)) {
      closeMenu();
    }
  });
}
