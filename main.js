// import "./style.css";
import "lazysizes";
import emailjs from "@emailjs/browser";

emailjs.init("SSGMoBteY1IqEzwlA");

// console.log("Lazysizes loaded");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded");

  // nav-bar
  const navbar = document.querySelector(".side-nav");
  const togglebtn = document.querySelector(".toggle-btn");

  togglebtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
    togglebtn.classList.toggle("active");
  });

  // Preload pour l'image en background-image.
  // Dans la balise <head> on préload l'image de la balise <img> avec 'imagesrcset'. Mais comme l'image de fond de la section "héro" est décide par le css avec Média Query, on utilise JS pour anticiper la taille d'image qui sera décidé par le css en fonction de la taille d'écran du user.
  // Preload background-image pour la classe "hero"
  // var link = document.createElement("link");
  // link.rel = "preload";
  // link.as = "image";

  // if (window.matchMedia("(min-width: 1024px)").matches) {

  //   link.href = "/20-fond-hero-section-1400.jpeg";
  // } else {

  //   link.href = "/20-fond-hero-section-800.jpeg";
  // }

  // document.head.appendChild(link);

  const preloadImage = new Promise((resolve, reject) => {
    var link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";

    // Détecte la taille de l'écran et charge l'image correspondante
    if (window.matchMedia("(min-width: 1024px)").matches) {
      link.href = "/20-fond-hero-section-1400.jpeg";
    } else {
      link.href = "/20-fond-hero-section-800.jpeg";
    }

    // Quand l'image est chargée, on résout la promesse
    link.onload = () => resolve();
    link.onerror = () => reject(new Error("Erreur lors du chargement de l'image"));
    document.head.appendChild(link);
  });

  // function showContent() {
  //   document.querySelector(".loader-container").classList.add("hidden");
  // }

  // Fonction pour montrer la section "hero"
  // function showHeroSection() {
  //   const heroSection = document.querySelector(".hero");
  //   heroSection.style.opacity = "1"; // Rendre la section visible
  //   heroSection.style.visibility = "visible";
  // }

  // Fonction pour initialiser Particles.js
  function initializeParticles() {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 65,
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
          width: 1,
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
  }

  // Retirer le loader après 1 seconde, puis afficher la section "hero"
  // setTimeout(() => {
  // showContent(); // Cache le loader

  // Fonction pour inverser les couleurs lorsque l'utilisateur scrolle
  function handleColorInversion() {
    console.log("handleColorInversion appelée");
    const pricingSection = document.querySelector("#prix");
    if (!pricingSection) {
      console.error("La section #prix n'existe pas dans le DOM.");
      return; // Quitte la fonction si l'élément n'existe pas
    }
    console.log(pricingSection); // Debugging

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
      threshold: 0.5,
    });

    observer.observe(pricingSection);
  }

  // setTimeout(() => {
  // showContent();
  // setTimeout(() => {
  // showHeroSection();
  // Affiche la section "hero" après le retrait du loader

  // }, 1500);
  // }, 700);

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

  const binary1 = ["01000100 11000011 10101001"]; // Valeur binaire initiale pour #text1
  const binary2 = ["MaVitrineDuWeb.fr"]; // Valeur binaire initiale pour #text2

  const phrases1 = ["Développeur Web"]; // Phrase à afficher dynamiquement pour #text1
  const phrases2 = ["A La Rochelle"]; // Phrase à afficher dynamiquement pour #text2

  const el1 = document.getElementById("text1"); // Élément avec id="text1"
  const el2 = document.getElementById("text2"); // Élément avec id="text2"

  const fx1 = new TextScramble(el1); // Instance pour le texte dans #text1
  const fx2 = new TextScramble(el2); // Instance pour le texte dans #text2

  let counter1 = 0;
  let counter2 = 0;

  const cycleTexts = () => {
    // Afficher les phrases dynamiquement dans #text1 et #text2
    fx1.setText(binary1[counter1]).then(() => {
      setTimeout(() => {
        fx2.setText(binary2[counter2]).then(() => {
          // Après avoir affiché les deux phrases, réinitialiser avec les valeurs binaires
          setTimeout(() => {
            fx1.setText(phrases1[counter1]).then(() => {
              fx2.setText(phrases2[counter2]).then(() => {
                setTimeout(cycleTexts, 900); // Répéter le cycle après un délai
              });
            });
          }, 200); // Délai avant de réinitialiser avec les valeurs binaires
        });
      }, 200); // Délai entre #text1 et #text2
    });
  };

  const initialize = () => {
    // Afficher les valeurs binaires initiales
    fx1.setText(phrases1[counter1]).then(() => {
      fx2.setText(phrases2[counter2]).then(() => {
        // Démarrer l'animation des phrases après les binaires
        setTimeout(cycleTexts, 500);
      });
    });
  };

  initialize();
  // initializeParticles();
  // handleColorInversion();
  preloadImage
    .then(() => {
      console.log("Image préchargée, initialisation des particules et inversion des couleurs");
      initializeParticles();
      handleColorInversion();
    })
    .catch((error) => {
      console.error("Une erreur s'est produite :", error);
    });
});

// Animation on scroll
const sr = ScrollReveal({
  origin: "bottom",
  distance: "60px",
  duration: 1000,
  delay: 100,
  easing: "ease-in-out",
});

sr.reveal(".contact-form h1");
sr.reveal(".contact-form p", { delay: 300 });
sr.reveal(".contact-form form input:nth-child(2)", { delay: 400 });
sr.reveal(".contact-form form input:nth-child(3)", { delay: 500 });
sr.reveal(".contact-form form input:nth-child(4)", { delay: 600 });
sr.reveal(".contact-form form textarea", { delay: 700 });
sr.reveal(".submit-form-btn", { delay: 200 });
// Section
sr.reveal(".presentation", { delay: 200 });
sr.reveal(".div-phone", { delay: 300 });
sr.reveal(".services-flex", { delay: 300 });
sr.reveal(".stape-card", { delay: 300 });
sr.reveal(".pricing", { delay: 500 });
sr.reveal(".skills", { delay: 300 });
sr.reveal("#themes", { delay: 300 });

// Formulaires de contact - envoie de l'email

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
