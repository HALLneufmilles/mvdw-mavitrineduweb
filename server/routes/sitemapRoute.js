// server/routes/sitemapRoute.js
import { Router } from "express";
import Post from "../models/Post.js"; // Ton modèle Mongoose

import { createUniqueSlug } from "../utils/slug.js";
import { getPageLastmodState } from "../utils/pageLastmod.js";
import {
  buildSitemapXml,
  createPostUrls,
  createStaticUrls
} from "../utils/sitemap.js";

const router = Router();

router.get("/sitemap.xml", async (req, res) => {
  try {
    // 1) Récupération de tous les articles
    //    On ne projette que _id et updatedAt, puisque nous utiliserons updatedAt pour lastmod
    //    (Tu peux ajouter createdAt également si tu en as un usage ; dans le sitemap standard,
    //     seul lastmod est réellement pris en compte par Google.)
    const posts = await Post.find(
      { $or: [{ status: "published" }, { status: { $exists: false } }] },
      { _id: 1, title: 1, slug: 1, updatedAt: 1 }
    );

    for (const post of posts) {
      if (!post.slug) {
        post.slug = await createUniqueSlug(Post, post.title, post._id);
        await post.save();
      }
    }

    // 2) Dates persistantes des présentations statiques, synchronisées au démarrage.
    const pageLastmodState = await getPageLastmodState();
    const staticUrls = createStaticUrls(pageLastmodState, posts);

    // 3) URLs dynamiques pour les articles, toujours composées avec leur slug.
    const blogUrls = createPostUrls(posts);

    // 4) Génère le XML en conservant le domaine et les URLs existants.
    const sitemapXml = buildSitemapXml([...staticUrls, ...blogUrls]);

    // 6) Envoie la réponse
    res.setHeader("Content-Type", "application/xml");
    return res.status(200).send(sitemapXml);
  } catch (error) {
    console.error("Erreur lors de la génération du sitemap :", error);
    return res.sendStatus(500);
  }
});

export default router;
