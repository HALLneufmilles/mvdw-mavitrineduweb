function showVoletBoxs() {
  console.log("showVoletBoxs appellée");

  // On contrôle l'existence de l'élément 'footer'
  const footer = document.querySelector("#footer");
  if (!footer) {
    console.error("L'élément #footer n'existe pas dans le DOM.");
    return; // Quitte la fonction si l'élément n'existe pas
  }

  const boxElements = document.querySelectorAll(".box");

  // Fonction de rappel pour l'observer
  const handleBoxVisibility = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible-box");
        entry.target.classList.remove("hidden-box");
      } else {
        entry.target.classList.add("hidden-box");
        entry.target.classList.remove("visible-box");
      }
    });
  };

  const observer = new IntersectionObserver(handleBoxVisibility, {
    threshold: 0.1, // Ajuste le seuil d'intersection si nécessaire
  });

  boxElements.forEach((box) => observer.observe(box));

  // const handleBoxesVisibility = (entries) => {
  //   entries.forEach((entry) => {
  //     if (entry.isIntersecting) {
  //       boxElements.forEach((box) => {
  // box.classList.remove("hidden-box");
  // box.classList.add("visible-box");
  // box.style.opacity = "1";
  // box.style.visibility = "visible";
  //       });
  //     } else {
  //       boxElements.forEach((box) => {
  //         box.classList.remove("visible-box");
  //         box.classList.add("hidden-box");
  //         // box.style.opacity = "0";
  //         // box.style.visibility = "hidden";
  //       });
  //     }
  //   });
  // };

  // Création de l'observer avec un threshold de 0.1 (10%)
  // const observer = new IntersectionObserver(handleBoxesVisibility, {
  //   threshold: 0.1,
  // });

  // // Observer le footer
  // observer.observe(footer);
}
