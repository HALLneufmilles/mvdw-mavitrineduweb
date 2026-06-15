// Transforme un titre humain en slug lisible pour une URL.
export function createSlug(value = "") {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Cree un slug unique en ajoutant -2, -3, etc. si le slug existe deja.
export async function createUniqueSlug(PostModel, title, currentPostId = null) {
  const baseSlug = createSlug(title) || "article";
  let slug = baseSlug;
  let count = 2;

  while (true) {
    const query = { slug };
    if (currentPostId) query._id = { $ne: currentPostId };

    const existingPost = await PostModel.findOne(query).select("_id").lean();
    if (!existingPost) return slug;

    slug = `${baseSlug}-${count}`;
    count += 1;
  }
}
