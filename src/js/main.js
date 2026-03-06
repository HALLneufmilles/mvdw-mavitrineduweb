// import "./style.css";

import "lazysizes";
import emailjs from "@emailjs/browser";
import { initNav } from "./nav.js";

emailjs.init("SSGMoBteY1IqEzwlA");

const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
const isAndroid = navigator.userAgent.toLowerCase().includes("android");

const isSmartphone =
  window.matchMedia("(orientation: portrait)").matches ||
  window.innerWidth < 940;

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded");

  if (
    isFirefox &&
    isAndroid &&
    window.matchMedia("(orientation: portrait)").matches
  ) {
    document.querySelectorAll(".box-sticky").forEach((box) => {
      box.style.position = "static";
    });
  }

  initNav();

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("load", () => {
    // S'il y a une ancre, on ne force pas le top
    if (window.location.hash) return;

    window.scrollTo({ top: 0, behavior: "auto" });
  });

  const preloadImage = new Promise((resolve, reject) => {
    const img = new Image();

    // Détecte la taille de l'écran et charge l'image correspondante
    img.src = window.matchMedia("(min-width: 1024px)").matches
      ? "/img/hero/20-fond-hero-section-1400.webp"
      : "/img/hero/20-fond-hero-section-800.webp";

    img.onload = () => resolve();
    img.onerror = () =>
      reject(
        new Error("Erreur lors du chargement de l'image 20-fond-hero-section"),
      );
  });

  function revealBoxesAtScroll(threshold = 0.5) {
    // threshold = 0.5 (milieu), 0.9 (bas), etc.
    const boxes = document.querySelectorAll(".box");

    // S’assurer qu’elles sont bien cachées au départ (au cas où)
    boxes.forEach((b) => {
      b.classList.add("hidden-box");
      b.classList.remove("visible-box");
    });

    let ticking = false;

    function pageProgress() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const viewportH = window.innerHeight || doc.clientHeight || 0;
      const docH = doc.scrollHeight || 1; // éviter /0
      return (scrollTop + viewportH) / docH;
    }

    function revealNow() {
      boxes.forEach((b) => {
        b.classList.remove("hidden-box");
        b.classList.add("visible-box");
      });
    }

    function checkAndReveal() {
      if (pageProgress() >= threshold) {
        revealNow();
        // une fois révélé, on stoppe les écouteurs
        window.removeEventListener("scroll", onScroll, passiveTrue);
        window.removeEventListener("resize", onResize);
      }
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkAndReveal();
          ticking = false;
        });
        ticking = true;
      }
    }

    function onResize() {
      checkAndReveal();
    }

    const passiveTrue = { passive: true };
    window.addEventListener("scroll", onScroll, passiveTrue);
    window.addEventListener("resize", onResize);

    // au cas où l’utilisateur arrive via un lien profond (#id) déjà bas dans la page
    checkAndReveal();
  }

  // Fonction pour initialiser Particles.js
  function initializeParticles() {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: isSmartphone ? 100 : 65,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            src: "img/github.svg",
            width: 100,
            height: 100,
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 236.74429248968178,
          color: "#ffffff",
          opacity: 0.4,
          width: isSmartphone ? 2 : 1,
        },
        move: {
          enable: true,
          speed: 5,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });

    if (isSmartphone) {
      setTimeout(() => {
        console.log("Arrêt des particules smartphone");
        if (window.pJSDom && window.pJSDom.length > 0) {
          const particlesInstance = window.pJSDom[0].pJS;

          // Désactiver le mouvement
          particlesInstance.particles.move.enable = false;

          // Relancer le fonctionnement des particules pour appliquer les changements
          particlesInstance.fn.particlesRefresh();
        }
      }, 10000);
    }
  }

  // Fonction pour inverser les couleurs lorsque l'utilisateur scrolle
  function handleColorInversion() {
    console.log("handleColorInversion appelée");
    const pricingSection = document.querySelector("#prix");
    if (!pricingSection) {
      console.error("La section #prix n'existe pas dans le DOM.");
      return; // Quitte la fonction si l'élément n'existe pas
    }
    console.log(pricingSection); // Debugging

    // Définir le threshold en fonction du type d'appareil
    const threshold = isSmartphone ? 0.1 : 0.7;

    const invertColors = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.documentElement.classList.add("root-inverted");
        } else {
          document.documentElement.classList.remove("root-inverted");
        }
      });
    };

    const observer = new IntersectionObserver(invertColors, {
      threshold: threshold,
    });

    observer.observe(pricingSection);
  }

  // TextScramble (texte défilant section hero)
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = "01";
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || "";
        const to = newText[i] || "";
        const start = Math.floor(Math.random() * 80);
        const end = start + Math.floor(Math.random() * 80);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }

    update() {
      let output = "";
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  const phrases1 = ["Développeur Web"]; // Valeur binaire initiale pour #text1
  const phrases2 = ["A La Rochelle"]; // Valeur binaire initiale pour #text2

  // Phrase à afficher dynamiquement pour #text1
  const binary1 = ["01000100 11000011 10101001"];
  // Phrase à afficher dynamiquement pour #text2
  const binary2 = ["MaVitrineDuWeb.fr"];

  const el1 = document.getElementById("text1"); // Élément avec id="text1"
  const el2 = document.getElementById("text2"); // Élément avec id="text2"

  const fx1 = new TextScramble(el1); // Instance pour le texte dans #text1
  const fx2 = new TextScramble(el2); // Instance pour le texte dans #text2

  // let counter1 = 0;
  // let counter2 = 0;
  let cycleCounter = 0; // Compteur pour limiter les cycles

  const cycleTexts = () => {
    console.log("lancemant cycleTexts()");

    if (isSmartphone && cycleCounter >= 1) {
      console.log("cycleCounter :", cycleCounter);
      console.log("isSmartphone :", isSmartphone);
      return; // Arrêter l'animation après 1 cycle sur les smartphones
    }

    fx1.setText(binary1[cycleCounter % binary1.length]).then(() => {
      setTimeout(() => {
        fx2.setText(binary2[cycleCounter % binary2.length]).then(() => {
          setTimeout(() => {
            fx1.setText(phrases1[cycleCounter % phrases1.length]).then(() => {
              fx2.setText(phrases2[cycleCounter % phrases2.length]).then(() => {
                cycleCounter++;
                setTimeout(cycleTexts, 900); // Délai avant de répéter le cycle
              });
            });
          }, 200); // Délai avant de réinitialiser avec les phrases
        });
      }, 200); // Délai entre les deux éléments
    });
  };

  // const initialize = () => {
  //   // Afficher les valeurs binaires initiales directement (sans animation)
  //   el1.innerText = binary1[0];
  //   el2.innerText = binary2[0];

  //   // Vérifier s'il s'agit d'un smartphone
  //   if (isSmartphone) {
  //     // Pour les smartphones, effectuer un seul cycle d'animation
  //     setTimeout(() => {
  //       fx1.setText(phrases1[0]).then(() => {
  //         fx2.setText(phrases2[0]).then(() => {
  //           setTimeout(cycleTexts, 500); // Démarrer le cycle après un délai
  //           console.log("Animation pour smartphone");
  //         });
  //       });
  //     }, 500); // Délai avant de démarrer l'animation
  //   } else {
  //     // Pour les autres appareils, continuer les cycles d'animation
  //     setTimeout(() => {
  //       fx1.setText(phrases1[0]).then(() => {
  //         fx2.setText(phrases2[0]).then(() => {
  //           setTimeout(cycleTexts, 500); // Démarrer le cycle après un délai
  //         });
  //       });
  //     }, 500); // Délai avant de démarrer l'animation
  //   }
  // };

  const initialize = () => {
    el1.innerText = binary1[0];
    el2.innerText = binary2[0];
    setTimeout(() => cycleTexts(), 1200);
  };

  preloadImage
    .then(() => {
      console.log(
        "Image préchargée, initialisation des particules et inversion des couleurs",
      );
      initRevealOnScroll();
      initializeParticles();
      initialize();
      handleColorInversion();
      // showVoletBoxs();
      revealBoxesAtScroll(0.5); // 0.5 = milieu ; mets 0.9 pour bas de page
    })
    .catch((error) => {
      console.error("Une erreur s'est produite :", error);
    });
});

// ---------- Scrollreveal -------------------

// Animation on scroll:
// paramètres par défaut:
// const sr = ScrollReveal({
//   origin: "bottom",
//   distance: "60px",
//   duration: 1000,
//   delay: 100,
//   easing: "ease-in-out",
// });

// sr.reveal("#hero-section", { delay: 200, distance: "400px", duration: 1300 });
// sr.reveal(".presentation", { delay: 200, distance: "100px" });
// sr.reveal(".messagedefilant", { delay: 200, distance: "200px" });
// sr.reveal(".div-phone", { delay: 300 });
// sr.reveal(".services-title", { delay: 200, distance: "200px" });
// sr.reveal(".card", { delay: 200, distance: "200px" });
// sr.reveal(".stape-container", { delay: 200, distance: "200px" });
// sr.reveal(".stape-card", { delay: 200, distance: "200px" });
// sr.reveal(".pricing", { delay: 200 });
// sr.reveal("#themes", { delay: 200, distance: "100px" });
// sr.reveal(".skills", { delay: 200, distance: "100px" });
// sr.reveal(".contact-form", { delay: 200, distance: "100px" });
// sr.reveal(".buton-phone", { delay: 600 });

// ---------- Fin Scrollreveal -------------------

// -------------- Scroll Anim version maison ------------
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  console.log("items :", items);

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target); // one-shot (comme ScrollReveal)
        }
      });
    },
    { threshold: 0.15 },
  );

  items.forEach((el) => obs.observe(el));
}
// ----------------------------------------------------

// ----- Formulaires de contact - envoie de l'email --

window.sendMail = function () {
  // Récupérer le formulaire
  const form = document.getElementById("contact-form");

  let params = {
    user_name: document.getElementById("user_name").value,
    user_email: document.getElementById("user_email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
    contact_number: document.getElementById("contact_number").value,
  };
  console.log("params:", params);

  emailjs
    .send("service_e1lshyl", "template_nroyljv", params)
    .then((response) => {
      alert("Email Sent!");
      console.log("SUCCESS", response);
      // Réinitialiser le formulaire après l'envoi
      form.reset();
    })
    .catch((error) => {
      console.error("Failed to send email: ", error);
      console.log("afetr catch params:", params);
    });
};

//  fonction à utiliser uniquement pour afficher puis copier/coller la date dans <meta property="og:updated_time" content="2024-09-27T18:43:17+02:00" /> avant chaque grosse mise à jour pour le SEO.
// https://chatgpt.com/share/66f6e0dc-aa90-800d-80bf-96f8c4ae9340
// function formatISODate(date) {
//   const timezoneOffset = -date.getTimezoneOffset();
//   const diff = timezoneOffset >= 0 ? "+" : "-";
//   const pad = (num) => String(num).padStart(2, "0");

//   const hours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
//   const minutes = pad(Math.abs(timezoneOffset) % 60);

//   return (
//     date.getFullYear() +
//     "-" +
//     pad(date.getMonth() + 1) +
//     "-" +
//     pad(date.getDate()) +
//     "T" +
//     pad(date.getHours()) +
//     ":" +
//     pad(date.getMinutes()) +
//     ":" +
//     pad(date.getSeconds()) +
//     diff +
//     hours +
//     ":" +
//     minutes
//   );
// }

// const updatedTime = formatISODate(new Date());
// console.log(updatedTime);
