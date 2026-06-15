/**
 *  editor.js  – bannière + illustrations  (add-post & edit-post)
 *  -----------------------------------------------------------------
 *  🆕 2025-05-17
 *      • ctrl/⌘+clic        = aperçu sans ouverture d’explorateur
 *      • remplacement img   = supprime l’ancienne (temp | uploads)
 *  -----------------------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", () => {
  // ================================================================
  // 1.  BANNIÈRE (déjà existante)
  // ================================================================
  const bannerDiv = document.querySelector("#banner-edit");
  const bannerUpload = document.querySelector("#banner-upload");
  const savedImage = sessionStorage.getItem("tempBannerImage");
  const currentUrl = window.location.pathname;
  const pageType = currentUrl.includes("edit-post") ? "edit-post" : "add-post";

  if (savedImage && bannerDiv)
    bannerDiv.style.backgroundImage = `url("${savedImage}")`;

  if (bannerUpload) {
    bannerUpload.addEventListener("change", () => {
      const [file] = bannerUpload.files;
      if (!file || !file.type.includes("image")) return;

      const fr = new FileReader();
      fr.onload = (e) => {
        const base64 = e.target.result;
        sessionStorage.setItem("tempBannerImage", base64);
        bannerDiv.style.backgroundImage = `url("${base64}")`;
      };
      fr.readAsDataURL(file);
    });
  }

  // ================================================================
  // 2.  ILLUSTRATIONS
  // ================================================================
  // Upload images
  const uploadWrappers = [...document.querySelectorAll(".upload-wrapper")];
  // Image d'illustration
  const previewDiv = document.querySelector(".product-image");
  // lien markdown
  const linkImageInput = document.getElementById("link-image");
  const copyLinkBtn = document.getElementById("copy-link-btn");

  /* Bouton « Copier » lien Markdown */
  if (copyLinkBtn && linkImageInput) {
    copyLinkBtn.addEventListener("click", () => {
      navigator.clipboard
        .writeText(linkImageInput.value)
        .then(() => alert("Lien copié !"));
    });
  }

  /* ----- sessionStorage utils ------------------------------------ */
  const getStoredIllustrations = () =>
    JSON.parse(sessionStorage.getItem("illustrations")) || [];

  const setStoredIllustrations = (arr) =>
    sessionStorage.setItem("illustrations", JSON.stringify(arr));

  function updateIllustration(uid, url, filename) {
    const list = getStoredIllustrations();
    const itm = list.find((o) => o.uid === uid);
    itm
      ? Object.assign(itm, { url, filename })
      : list.push({ uid, url, filename });
    setStoredIllustrations(list);
  }

  /* 2-A. Pré-remplissage storage (edit-post) ----------------------- */
  // if (pageType === "edit-post" && !sessionStorage.getItem("illustrations")) {
  if (pageType === "edit-post") {
    // ⇦ on force le reset
    sessionStorage.removeItem("illustrations"); // vide les anciens essais
    // … puis on peut pré-remplir proprement
    if (!sessionStorage.getItem("illustrations")) {
      const initial = [];
      uploadWrappers.forEach((w) => {
        const lbl = w.querySelector(".upload-image");
        const del = w.querySelector(".delete-image");
        if (!lbl) return;
        const m = lbl.style.backgroundImage.match(/url\("(.*)"\)/);
        if (!m) return;
        initial.push({ uid: w.dataset.tempid, url: m[1], filename: "" });
        if (del) {
          del.hidden = false;
          del.style.display = "block";
        }
      });
      setStoredIllustrations(initial);
    }
  }
  /* 2-B. Restauration visuelle ------------------------------------ */
  // On lance la fonction contenue dans la constatnte getStoredIllustrations.
  // C'est la raison pour laquelle on ajoute les ().
  getStoredIllustrations().forEach(({ uid, url }) => {
    const wrap = document.querySelector(
      `.upload-wrapper[data-tempid="${uid}"]`
    );
    if (!wrap) return;
    const lbl = wrap.querySelector(".upload-image");
    const btn = wrap.querySelector(".delete-image");
    if (lbl) lbl.style.backgroundImage = `url("${url}")`;
    if (btn) {
      btn.hidden = false;
      btn.style.display = "block";
    }
  });

  /* 2-C. Première image active ------------------------------------ */
  (function ensureFirstActive() {
    let curr = document.querySelector(".upload-image.active");
    if (!curr) {
      curr = uploadWrappers
        .map((w) => w.querySelector(".upload-image"))
        .find(
          (l) =>
            l && l.style.backgroundImage && l.style.backgroundImage !== "none"
        );
      if (curr) curr.classList.add("active");
    }
    if (curr && previewDiv)
      previewDiv.style.backgroundImage = curr.style.backgroundImage;
  })();

  // ================================================================
  // 3.  Boucle wrapper
  // ================================================================
  uploadWrappers.forEach((wrapper) => {
    const input = wrapper.querySelector(".fileupload");
    const label = wrapper.querySelector(".upload-image");
    const deleteBtn = wrapper.querySelector(".delete-image");
    const tempId = wrapper.dataset.tempid;

    /* 3-A. UPLOAD -------------------------------------------------- */
    if (input) {
      input.addEventListener("change", function () {
        const file = this.files[0];
        if (!file || !file.type.includes("image"))
          return alert("Veuillez sélectionner une image.");

        // 🔄 retrouver l’éventuelle image précédente (temp ou uploads)
        const previous = getStoredIllustrations().find((o) => o.uid === tempId);

        const fd = new FormData();
        fd.append("image", file);
        fetch("/blog/upload-illustration", { method: "POST", body: fd })
          .then((r) => r.json())
          .then(async ({ success, imageUrl }) => {
            if (!success) return alert("Erreur lors de l'upload.");

            /* 🔄 suppression éventuelle de l’ancienne image
               (temp OU uploads) */
            if (previous && previous.url) {
              try {
                await fetch("/blog/delete-image", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url: previous.url })
                });
              } catch (err) {
                console.warn("Suppression ancienne image :", err);
              }
            }

            const fullUrl = `${window.location.origin}${imageUrl}`;
            const mdLink = `![${file.name}](${fullUrl})`;

            label.style.backgroundImage = `url("${fullUrl}")`;
            if (deleteBtn) {
              deleteBtn.hidden = false;
              deleteBtn.style.display = "block";
            }
            if (previewDiv)
              previewDiv.style.backgroundImage = `url("${fullUrl}")`;
            if (linkImageInput) linkImageInput.value = mdLink;

            updateIllustration(tempId, fullUrl, file.name);
          })
          .catch((err) => console.error("Erreur d'upload :", err));
      });
    }

    /* 3-B. CLICK label  (aperçu + raccourci) ----------------------- */
    if (label) {
      label.addEventListener("click", function (e) {
        if (
          !label.style.backgroundImage ||
          label.style.backgroundImage === "none"
        )
          return; // wrapper vide

        const previewOnly = e.ctrlKey || e.metaKey;
        const alreadyActive = this.classList.contains("active");

        if (previewOnly || (pageType === "add-post" && alreadyActive))
          e.preventDefault(); // bloque l’explorateur

        let item = getStoredIllustrations().find((o) => o.uid === tempId);
        if (!item) {
          // fallback depuis style
          const m = label.style.backgroundImage.match(/url\("(.*)"\)/);
          if (m) item = { url: m[1], filename: "" };
        }
        if (item) {
          if (previewDiv)
            previewDiv.style.backgroundImage = `url("${item.url}")`;
          if (linkImageInput)
            linkImageInput.value = `![${item.filename}](${item.url})`;
        }

        document
          .querySelectorAll(".upload-image.active")
          .forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      });
    }

    /* 3-C. DELETE -------------------------------------------------- */
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // 🔄 suppression côté serveur (temp ou uploads)
        const match = label.style.backgroundImage.match(/url\("(.*)"\)/);
        if (match) {
          fetch("/blog/delete-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: match[1] })
          }).catch(() => {});
        }

        label.style.backgroundImage = "none";
        deleteBtn.hidden = true;

        setStoredIllustrations(
          getStoredIllustrations().filter((o) => o.uid !== tempId)
        );

        if (label.classList.contains("active")) {
          label.classList.remove("active");
          if (previewDiv) previewDiv.style.backgroundImage = "none";
          if (linkImageInput) linkImageInput.value = "";
        }
      });
    }
  });

  // ================================================================
  // 4.  SUBMIT : nettoyage (hors Preview)
  // ================================================================
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (evt) => {
      if (evt.submitter === document.querySelector(".btn-preview")) return;
      sessionStorage.removeItem("tempBannerImage");
      sessionStorage.removeItem("illustrations");
    });
  }

  // ================================================================
  // 5.  Nettoyage bannière au retour dashboard
  // ================================================================
  // if (currentUrl.includes("dashboard") && savedImage && bannerDiv) {
  if (currentUrl.includes("dashboard")) {
    sessionStorage.removeItem("tempBannerImage");
    sessionStorage.removeItem("illustrations");
    bannerDiv.style.backgroundImage = "";
  }
});
