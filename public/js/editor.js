/**
 * editor.js - banniere + selecteur d'images d'illustration
 * Utilise par add-post.ejs et edit-post.ejs.
 */

document.addEventListener("DOMContentLoaded", () => {
  const bannerDiv = document.querySelector("#banner-edit");
  const bannerUpload = document.querySelector("#banner-upload");
  const savedImage = sessionStorage.getItem("tempBannerImage");
  const currentUrl = window.location.pathname;
  const isPostEditorPage =
    currentUrl.includes("add-post") || currentUrl.includes("edit-post");
  const pageType = currentUrl.includes("edit-post") ? "edit-post" : "add-post";
  let shouldCleanupTemporaryImages = true;

  if (savedImage && bannerDiv) {
    bannerDiv.style.backgroundImage = `url("${savedImage}")`;
  }

  if (bannerUpload && bannerDiv) {
    bannerUpload.addEventListener("change", () => {
      const [file] = bannerUpload.files;
      if (!file || !file.type.includes("image")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        sessionStorage.setItem("tempBannerImage", base64);
        bannerDiv.style.backgroundImage = `url("${base64}")`;
      };
      reader.readAsDataURL(file);
    });
  }

  const uploadWrappers = [...document.querySelectorAll(".upload-wrapper")];
  const previewDiv = document.querySelector(".product-image");
  const linkImageInput = document.getElementById("link-image");
  const copyLinkBtn = document.getElementById("copy-link-btn");

  if (copyLinkBtn && linkImageInput) {
    copyLinkBtn.addEventListener("click", () => {
      navigator.clipboard
        .writeText(linkImageInput.value)
        .then(() => alert("Lien copie !"));
    });
  }

  const getStoredIllustrations = () =>
    JSON.parse(sessionStorage.getItem("illustrations")) || [];

  const setStoredIllustrations = (illustrations) => {
    sessionStorage.setItem("illustrations", JSON.stringify(illustrations));
  };

  function getBackgroundImageUrl(element) {
    if (!element || !element.style.backgroundImage) return "";
    const match = element.style.backgroundImage.match(/^url\(["']?(.*?)["']?\)$/);
    return match ? match[1] : "";
  }

  function setDeleteButtonVisible(button, isVisible) {
    if (!button) return;
    button.hidden = !isVisible;
    button.style.display = isVisible ? "flex" : "none";
  }

  function setIllustrationVisualState(label, deleteButton, url = "") {
    if (!label) return;

    const hasImage = Boolean(url);
    label.style.backgroundImage = hasImage ? `url("${url}")` : "none";
    label.classList.toggle("has-image", hasImage);
    setDeleteButtonVisible(deleteButton, hasImage);
  }

  function isTemporaryImageUrl(url) {
    if (!url) return false;

    try {
      return new URL(url, window.location.origin).pathname.startsWith("/temp/");
    } catch {
      return url.startsWith("/temp/") || url.includes("/temp/");
    }
  }

  function getImagePath(url) {
    if (!url) return "";

    try {
      return new URL(url, window.location.origin).pathname;
    } catch {
      return url.startsWith("/") ? url : `/${url}`;
    }
  }

  function deleteImage(url, keepalive = false) {
    return fetch("/blog/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      keepalive
    });
  }

  function cleanupTemporaryIllustrations() {
    getStoredIllustrations()
      .filter((item) => isTemporaryImageUrl(item.url))
      .forEach((item) => {
        deleteImage(item.url, true).catch(() => {});
      });

    sessionStorage.removeItem("illustrations");
  }

  function cleanupUnreferencedTemporaryIllustrations() {
    const bodyInput = document.getElementById("textarea-body");
    const body = bodyInput ? bodyInput.value : "";

    getStoredIllustrations()
      .filter((item) => {
        if (!isTemporaryImageUrl(item.url)) return false;
        const imagePath = getImagePath(item.url);
        return imagePath && !body.includes(imagePath);
      })
      .forEach((item) => {
        deleteImage(item.url, true).catch(() => {});
      });
  }

  function updateIllustration(uid, url, filename) {
    const illustrations = getStoredIllustrations();
    const existing = illustrations.find((item) => item.uid === uid);

    if (existing) {
      Object.assign(existing, { url, filename });
    } else {
      illustrations.push({ uid, url, filename });
    }

    setStoredIllustrations(illustrations);
  }

  function removeIllustration(uid) {
    setStoredIllustrations(
      getStoredIllustrations().filter((item) => item.uid !== uid)
    );
  }

  function findIllustrationByLabel(label, uid) {
    const stored = getStoredIllustrations().find((item) => item.uid === uid);
    if (stored) return stored;

    const url = getBackgroundImageUrl(label);
    return url ? { uid, url, filename: "" } : null;
  }

  function setActiveIllustration(label, item) {
    if (!label || !item) return;

    document
      .querySelectorAll(".upload-image.active")
      .forEach((activeLabel) => activeLabel.classList.remove("active"));

    label.classList.add("active");

    if (previewDiv) {
      previewDiv.style.backgroundImage = `url("${item.url}")`;
    }

    if (linkImageInput) {
      linkImageInput.value = `![${item.filename || ""}](${item.url})`;
    }
  }

  function clearActivePreviewIfNeeded(label) {
    if (!label.classList.contains("active")) return;

    label.classList.remove("active");
    if (previewDiv) previewDiv.style.backgroundImage = "none";
    if (linkImageInput) linkImageInput.value = "";

    const nextWrapper = uploadWrappers.find((wrapper) => {
      const candidate = wrapper.querySelector(".upload-image");
      return candidate && candidate.classList.contains("has-image");
    });

    if (!nextWrapper) return;

    const nextLabel = nextWrapper.querySelector(".upload-image");
    const nextItem = findIllustrationByLabel(nextLabel, nextWrapper.dataset.tempid);
    setActiveIllustration(nextLabel, nextItem);
  }

  if (pageType === "edit-post") {
    sessionStorage.removeItem("illustrations");

    const initialIllustrations = [];
    uploadWrappers.forEach((wrapper) => {
      const label = wrapper.querySelector(".upload-image");
      const deleteButton = wrapper.querySelector(".delete-image");
      const url = getBackgroundImageUrl(label);

      if (!url) {
        setIllustrationVisualState(label, deleteButton);
        return;
      }

      setIllustrationVisualState(label, deleteButton, url);
      initialIllustrations.push({
        uid: wrapper.dataset.tempid,
        url,
        filename: ""
      });
    });

    setStoredIllustrations(initialIllustrations);
  }

  getStoredIllustrations().forEach(({ uid, url }) => {
    const wrapper = document.querySelector(`.upload-wrapper[data-tempid="${uid}"]`);
    if (!wrapper) return;

    setIllustrationVisualState(
      wrapper.querySelector(".upload-image"),
      wrapper.querySelector(".delete-image"),
      url
    );
  });

  const initialActiveWrapper =
    uploadWrappers.find((wrapper) =>
      wrapper.querySelector(".upload-image.active.has-image")
    ) ||
    uploadWrappers.find((wrapper) =>
      wrapper.querySelector(".upload-image.has-image")
    );

  if (initialActiveWrapper) {
    const label = initialActiveWrapper.querySelector(".upload-image");
    const item = findIllustrationByLabel(label, initialActiveWrapper.dataset.tempid);
    setActiveIllustration(label, item);
  }

  uploadWrappers.forEach((wrapper) => {
    const input = wrapper.querySelector(".fileupload");
    const label = wrapper.querySelector(".upload-image");
    const deleteButton = wrapper.querySelector(".delete-image");
    const tempId = wrapper.dataset.tempid;

    if (input && label) {
      input.addEventListener("change", function () {
        const file = this.files[0];
        if (!file || !file.type.includes("image")) {
          alert("Veuillez selectionner une image.");
          return;
        }

        const previous = getStoredIllustrations().find(
          (item) => item.uid === tempId
        );

        const formData = new FormData();
        formData.append("image", file);

        fetch("/blog/upload-illustration", {
          method: "POST",
          body: formData
        })
          .then((response) => response.json())
          .then(async ({ success, imageUrl }) => {
            if (!success) {
              alert("Erreur lors de l'upload.");
              return;
            }

            if (previous && isTemporaryImageUrl(previous.url)) {
              try {
                await deleteImage(previous.url);
              } catch (error) {
                console.warn("Suppression ancienne image :", error);
              }
            }

            const fullUrl = `${window.location.origin}${imageUrl}`;
            const item = { uid: tempId, url: fullUrl, filename: file.name };

            setIllustrationVisualState(label, deleteButton, fullUrl);
            updateIllustration(tempId, fullUrl, file.name);
            setActiveIllustration(label, item);
            input.value = "";
          })
          .catch((error) => console.error("Erreur d'upload :", error));
      });
    }

    if (label) {
      label.addEventListener("click", function (event) {
        if (!label.classList.contains("has-image")) return;

        event.preventDefault();
        const item = findIllustrationByLabel(label, tempId);
        setActiveIllustration(label, item);
      });
    }

    if (deleteButton && label) {
      deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const url = getBackgroundImageUrl(label);
        if (isTemporaryImageUrl(url)) {
          deleteImage(url).catch(() => {});
        }

        setIllustrationVisualState(label, deleteButton);
        removeIllustration(tempId);
        clearActivePreviewIfNeeded(label);
      });
    }
  });

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (event) => {
      shouldCleanupTemporaryImages = false;
      if (event.submitter === document.querySelector(".btn-preview")) return;
      cleanupUnreferencedTemporaryIllustrations();
      sessionStorage.removeItem("tempBannerImage");
      sessionStorage.removeItem("illustrations");
    });
  }

  window.addEventListener("pagehide", () => {
    if (!isPostEditorPage || !shouldCleanupTemporaryImages) return;
    cleanupTemporaryIllustrations();
  });

  if (currentUrl.includes("dashboard")) {
    sessionStorage.removeItem("tempBannerImage");
    sessionStorage.removeItem("illustrations");
    if (bannerDiv) bannerDiv.style.backgroundImage = "";
  }
});
