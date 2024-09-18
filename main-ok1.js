import "./style.css";
document.addEventListener("DOMContentLoaded", function () {
  try {
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
  } catch (e) {
    console.log("ParticlesJS error:", e);
  }
});
// Le reste de ton code...

// ——————————————————————————————————————————————————
// TextScramble - Section hero -
// ——————————————————————————————————————————————————

class TextScramble {
  constructor(el) {
    this.el = el;
    //   this.chars = "!<>-_\\/[]{}—=+*^?#________";
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
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
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

// —————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

const phrases = [
  "Développeur Web",
  // "sooner or later",
];

const el = document.querySelector(".text");
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 800);
  });
  counter = (counter + 1) % phrases.length;
};

next();

// ----------------------------------------------------
// text défilant
// ----------------------------------------------------
const tickerWrapper = document.querySelector(".tickerwrapper");
const list = document.querySelector("ul.list");

if (tickerWrapper && list) {
  // Duplicate the list items to create a seamless loop
  const clone = list.cloneNode(true);
  tickerWrapper.appendChild(clone);

  // Ensure the clone is placed right next to the original list
  clone.style.position = "absolute";
  clone.style.top = "0";
  clone.style.left = `${list.scrollWidth}px`;

  // Set up the animation
  const listWidth = list.scrollWidth;
  list.style.width = `${listWidth}px`;
  clone.style.width = `${listWidth}px`;

  // Define the animation keyframes
  list.style.animation = `ticker ${listWidth / 100}s linear infinite`;
  clone.style.animation = `ticker ${listWidth / 100}s linear infinite`;

  // Pause/Play animation on hover
  tickerWrapper.addEventListener("mouseenter", () => {
    list.style.animationPlayState = "paused";
    clone.style.animationPlayState = "paused";
  });

  tickerWrapper.addEventListener("mouseleave", () => {
    list.style.animationPlayState = "running";
    clone.style.animationPlayState = "running";
  });
}
