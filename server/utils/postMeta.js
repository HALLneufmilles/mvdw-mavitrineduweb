// Convertit le champ texte des tags en tableau propre pour MongoDB.
export function parseTags(value = "") {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

// Regroupe les champs SEO/admin d'un article avant creation ou modification.
export function getPostMetaFields(body) {
  return {
    seoTitle: body.seoTitle || body.title || "",
    seoDescription: body.seoDescription || body.description || "",
    bannerAlt: body.bannerAlt || body.title || "",
    authorName: body.authorName || "Deckard",
    status: body.status || "published",
    category: body.category || "",
    tags: parseTags(body.tags || ""),
    canonicalUrl: body.canonicalUrl || ""
  };
}
