//  "Post" dans 'export default mongoose.model("Post", PostSchema);' est le nom du "model Mongoose" de notre collection. un modèle Mongoose est une bibliothèque de Mongodb qui donne accès à d'autres fonctions pour facilite l'interaction avec les bases de données Mongodb. Un "modèle Mongoose" est une interface (Post.unefonction() ) que tu utilises pour interagir avec la base de données(voir dans main.js). Par exemple pour récupérer, ajouter, lire, mettre à jour, ou supprimer des documents. Mongodb va automatiquement créer une collection du même nom que le modèle dans la base de données . La collection est donc liée au modéle "Post", lui même structuré par la fonction "Schema()" de Mongoose qui done une structure aux documents de la base de données MongoDB. PostSchema est l'objet construit avec "Schema" qui contient les champs title, body, createdAt, etc. Chaque document de cette collection est un "post" avec ces propriétés.

// le model Post va être récupéré dans 'main.js'.

/* import mongoose from "mongoose";
import MarkdownIt from "markdown-it";
import { full as emoji } from "markdown-it-emoji";
import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";

const dompurify = createDomPurify(new JSDOM().window); */

// Configuration de markdown-it avec l'extension emoji
/* const md = new MarkdownIt();
md.use(emoji);

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  bannerImages: {
    ImgBase: { type: String, required: true },
    ImgConvert: { type: String, required: true },
    smallImgBase: { type: String, required: true },
    smallImgConvert: { type: String, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
});
 */
// Avant validation, transformer le Markdown et sécuriser le HTML
/* PostSchema.pre("validate", function (next) {
  if (this.body) {
    // Convertir le Markdown en HTML et nettoyer avec dompurify
    const html = md.render(this.body); // Transformation Markdown avec emojis
    this.sanitizedHtml = dompurify.sanitize(html); // Nettoyage
  }

  next();
}); */

// export default mongoose.model("Post", PostSchema);

/* const db = mongoose.connection.useDb("MVDW-Blog2");

export default db.model("Post", PostSchema); */

// marked(this.body): Transoforme le markdown en html .
// dompurify.sanitize(): netoie le HTML optimiser la sécurité .

import mongoose from "mongoose";
import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";
import { renderMarkdown } from "../helpers/markdownRenderer.js"; // Importer le fichier markdownRenderer.js

// Configuration de dompurify
const dompurify = createDomPurify(new JSDOM().window);
dompurify.setConfig({
  ADD_TAGS: ["iframe"],
  ADD_ATTR: [
    "allow",
    "allowfullscreen",
    "frameborder",
    "src", // Autorise l'attribut src pour les iframes
    "scrolling"
  ]
});

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  bannerImages: {
    ImgBase: { type: String, required: true },
    ImgConvert: { type: String, required: true },
    smallImgBase: { type: String, required: true },
    smallImgConvert: { type: String, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
});

// Middleware Mongoose avant validation pour transformer le Markdown en HTML sécurisé
PostSchema.pre("validate", function (next) {
  if (this.body) {
    // Utilisation de renderMarkdown pour traiter le Markdown avec toutes les extensions
    const html = renderMarkdown(this.body);
    // Nettoyage du HTML avec dompurify
    this.sanitizedHtml = dompurify.sanitize(html);
  }

  next();
});

// Exporter le modèle en utilisant la base de données spécifique
const db = mongoose.connection.useDb("MVDW-Blog2");
export default db.model("Post", PostSchema);
