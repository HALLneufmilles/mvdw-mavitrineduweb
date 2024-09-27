import { defineConfig } from "vite";
import sitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    sitemap({
      hostname: "https://mavitrineduweb.fr", // Remplace par ton domaine réel
      urls: [
        { loc: "/", lastmod: new Date().toISOString(), priority: 1.0 }, // Page principale
        { loc: "/#hero-section", lastmod: new Date().toISOString(), priority: 0.8 }, // Section hero
        { loc: "/#services", lastmod: new Date().toISOString(), priority: 0.8 }, // Section services
        { loc: "/#etapes", lastmod: new Date().toISOString(), priority: 0.7 }, // Section étapes
        { loc: "/#prix", lastmod: new Date().toISOString(), priority: 0.7 }, // Section prix
        { loc: "/#themes", lastmod: new Date().toISOString(), priority: 0.7 }, // Section thèmes
        { loc: "/#competences", lastmod: new Date().toISOString(), priority: 0.6 }, // Section compétences
        { loc: "/#contacts", lastmod: new Date().toISOString(), priority: 0.9 }, // Section contact
      ],
    }),
  ],
});
