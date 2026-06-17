// fichier ok, le suivant pour l'utilisation des tokens afin que l'utilisateur ne soit pas obligé de s'identifier à chaque fois.

import express from "express";
const router = express.Router();
import Post from "../models/Post.js";
import User from "../models/User.js";
import dotenv from "dotenv";
// Importer les fonctions de publication sociale
import { publishArticleToSelectedSocials } from "../helpers/sociaux.js";
dotenv.config();
// bcrypt est une bibliothèque utilisée pour sécuriser les mots de passe en les hachant avant de les stocker dans une base de données.
// Les mots de passe ne doivent jamais être stockés en texte brut dans une base de données, car cela représente un énorme risque de sécurité si la base est compromise.
// bcrypt permet de hachager (transformer) un mot de passe en une chaîne de caractères complexe qui n'est pas réversible, c’est-à-dire qu’on ne peut pas retrouver le mot de passe original depuis le haché sans une attaque par force brute.
// Lorsqu’un utilisateur s’inscrit, le mot de passe est haché avec bcrypt avant d'être enregistré.
// Lorsqu’un utilisateur se connecte, le mot de passe saisi est comparé au mot de passe haché stocké en utilisant bcrypt pour vérifier s'ils correspondent.
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

import fs from "fs/promises";
import fsSync from "fs";

import {
  processImage,
  processIllustrationImage
} from "../helpers/imageProcessor.js";
// dompurify pour nettoyer le HTML généréé par marked afin de supprimer tout contenu potentiellement dangereux (comme des balises <script> ou des événements JavaScript).
import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";
// marked transforme le Markdown en HTML
import { marked } from "marked";
import { renderMarkdown } from "../helpers/markdownRenderer.js"; // Importer le renderer
import { deletePostImages } from "../helpers/imageDeleter.js";
import { createUniqueSlug } from "../utils/slug.js";
import { getPostMetaFields, parseTags } from "../utils/postMeta.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

async function deletePublicImageIfExists(publicPath) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;

  const absolutePath = path.join(process.cwd(), "public", publicPath);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Impossible de supprimer ${publicPath} :`, error.message);
    }
  }
}

// Le layout spécifique pour la fonction render()
const adminLayout = "../views/layouts/admin.ejs";
const jwtSecret = process.env.JWT_SECRET;

/**
 *
 * // Middleware de vérification du Token :
 */
// Un middleware est une fonction qui intercepte une requête HTTP avant qu'elle n'atteigne sa destination finale (la route cible), comme dans 'router.get("/dashboard", authMiddleware, async (req, res) => { ... '
// Si un token valide est trouvé, la route cible est autorisée à poursuivre son exécution avec Next().
// next : Une fonction à appeler pour passer à l'étape suivante

// Middleware de vérification du Token pour autoriser l'accès au tableau de bord.
const authMiddleware = async (req, res, next) => {
  // Comme le cookie token est envoyé avec chaque requêtes , on peut intersepter le Token et vérifier sa validité.
  const token = req.cookies.token;
  // Si pas de Token, cela veut dire que soit l'utilisateur ne s'est pas connecté soit son token à expiré.
  // if (!token) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  if (!token) {
    // Si la requête vient d'un navigateur qui attend une page HTML
    if (req.accepts("html")) {
      return res.redirect("/blog/admin"); // redirection vers page login
    }
    // Si c'est une API qui attend JSON
    return res.status(401).json({ message: "Unauthorized – token missing" });
  }

  try {
    // Vérification de la validité du token
    const decoded = jwt.verify(token, jwtSecret);

    // Si le token est valide, on récupère l'utilisateur avec l'ID contenu dans le token
    req.userId = decoded.userId;

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findById(decoded.userId); // Utilisation de 'await' ici
    if (!user) {
      return res.status(401).json({ message: "User not found" }); // Si l'utilisateur n'est pas trouvé
    }

    // Ajouter l'utilisateur à la requête pour l'utiliser dans les routes suivantes et l'afficher dans header_admin.ejs .
    req.user = user;

    // Passe à la route suivante
    next();
  } catch (error) {
    if (req.accepts("html")) {
      return res.redirect("/blog/admin"); // redirection vers login
    }
    return res
      .status(401)
      .json({ message: "Unauthorized – token invalid or expired" });
  }
};

/**
 * GET  Admin - Login page
 **/
// *
// Accéder à la page admin :

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    };

    // Vérification du token JWT dans les cookies
    const token = req.cookies.token;

    if (token) {
      try {
        // Vérification du token et récupération des informations de l'utilisateur
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.userId);

        // Si le token est valide, tu peux maintenant utiliser les informations de l'utilisateur
        // Par exemple, tu pourrais les inclure dans locals pour les passer à la vue (si nécessaire)
        locals.username = user.username;

        // Redirection vers le dashboard
        return res.redirect("/blog/dashboard");
      } catch (error) {
        // Si le token est invalide ou expiré, afficher la page de connexion
        console.log("Token invalide ou expiré", error);
        return res.render("admin/index", { locals, layout: adminLayout });
      }
    } else {
      // Si aucun token n'est trouvé, afficher la page de connexion
      return res.render("admin/index", { locals, layout: adminLayout });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// render() stipule les données et la vue du dossier "views" à insérer dans l'élément "body" du layout. Sans layout indiqué en second argument, le layout indiqué par défaut dans 'server.js' sera utilisé. Les fichiers à la racine du dossier "views" sont par convention utilisés avec le layout par défaut. c'est la raison pour laquelle il n'est pas nécessaire de stipuler le layout par défaut lorqu'on utilise ces vues.
// Demade au server d'insérer les données et sa vue 'index.ejs' située dans le dossier "views/admin", dans l'élément "body" du layout. Ici on indique un layout spécifique à utiliser pour cette vue : adminLayout.
// router.get("/admin", async (req, res) => {
//   try {
//     // *'Local' pour la balise <head> du layout spécifique 'admin.ejs'.
//     const locals = {
//       title: "Admin",
//       description: "Simple Blog created with NodeJs, Express & MongoDb."
//     };

//     res.render("admin/index", { locals, layout: adminLayout });
//   } catch (error) {
//     console.log(error);
//   }
// });

/**
 * POST  Admin - Register
 **/
// *
/* *** Pour rappel : 
Lorsque l'utilisateur ouvre une page du site ou du blog, une requête HTTP est envoyée au serveur. Si l'utilisateur n'a pas de session active, session() dans server.js crée automatiquement une session avec un identifiant unique.

Cette session contient un ID (généré automatiquement par Express-session) et est configurée pour durer selon la durée définie dans cookie: { maxAge: 36000 }, ce qui signifie que la session est valide pendant 36 000 millisecondes (soit 6 minutes).

Le cookie de session est stocké côté client (dans le navigateur de l'utilisateur), mais l'ID de la session est également stocké côté serveur, dans la base de données de sessions MongoDB (via connect-mongo).*** */

// On enregistre un nouvel utilisateur.
// Ici l'utilisateur doit s'enregistrer. le formulaire envoi une requête POST '/register' que le server écoute avec 'router.post("/register", ...'. Le server récupère les données d'authentification, encode le password, puis crée un utilisateur dans la base de données. Comme pour "check Login 1" il s'agit d'une authentification stateful. L'ID de session est stocké côté client et server, mais les données utilisateur sont stockées uniquement côté serveur .
// '/register' POST vient de 'admin/index.ejs'
router.post("/register", async (req, res) => {
  try {
    // On récupère les informations d'inscription (username et password) que l'utilisateur a envoyées via le formulaire.
    const { username, password } = req.body;
    //bcrypt.hash(password, 10) utilise bcrypt pour transformer le mot de passe en une valeur hachée.
    // 10 est le nombre de tours de salage. Plus ce nombre est élevé, plus le processus de hachage est sécurisé (et coûteux en termes de temps de calcul).
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // User est le modèle lié à la collection du même nom + "s", crée dans Mongodb par Mongoost dans 'User.js'.
      // Donc ici on enregistre le username et le hashedPassword (mot de passe haché) dans la base de données.
      const user = await User.create({ username, password: hashedPassword });
      // Si l'utilisateur est créé avec succès, une réponse HTTP est envoyée par le seveur au navigateur avec le statut 201 (signifiant "Created"), et pour l'instant, un simple message JSON est renvoyé confirmant la création de l'utilisateur.
      // Les statut HTTP sont ajoutés dans les en-têtes de la réponse HTTP.
      // Associer l'ID de la session à l'utilisateur
      user.sessionId = req.session.id; // L'ID de session est généré par express-session

      // Sauvegarder l'utilisateur avec l'ID de session
      await user.save();

      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      //  Ce code d'erreur 11000 est spécifique à MongoDB et indique une violation de la contrainte d'unicité (username déja utilisé).
      if (error.code === 11000) {
        // statut 409 indique un conflit avec username
        res.status(409).json({ message: "User already in use" });
      }
      // indiquer une erreur interne au serveur. Cela signifie que quelque chose s'est mal passé côté serveur qui a empêché de répondre correctement.
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST  Admin - Login
 **/
// *
// "Check Login 2" Authentification d'un utilisateur avec JWT .
/* Pour rappel : 
  1- Lorsque l'utilisateur ouvre une page du site, une requête est envoiyée au server et session() de 'server.js' crée automatiquement une session avec 'saveUninitialized: true,' valable selon la durée définie également dans session() par 'cookie: {maxAge:36000}' .
  2- l'ID de session est stocké côté client et server, mais les données utilisateur sont stockées uniquement côté serveur (apparement pas très bon pour la sécurité. risque de piratage du server.) */

// Ici on part du principe que l'utilisateur s'est déja enregistré et que son mot de passe à été hashé durant l'inscription.
/* Pour rappel Dans une session basée sur un ID de session, le serveur génère un ID unique qui est ensuite stocké dans un cookie côté client. Le serveur stocke également cet ID en interne, ainsi que les données de session associées à l'utilisateur. 

// Ici pour la première visite l'utilisateur, lorsqu'il ouvre la page du site cela envoie une requête au server qui commence par regader si une session est en cours pour cet utilisateur. Si s'est le cas cela veut dire qu'il vient seulement de s'enregistré et donc qu'il n'a pas encore de Token. Pour cela le serveur commence par regarder dans les cookie du navigateur si il y à un ID de session. S'il y à un ID de session et qu'il est toujours valide cela veut dire qu'une session est bien en cours , l'utilisateur sera autorisé à ajouté de nouveaux posts. Sinon, l'utilisateur devra se reconnecter en entrant Login et mot de passe. le serveur intercepte la requêtre du formulaire, récupère mot de passe et username, commence par chercher le username dans la base de données, si ok compare le mot de passe du formulaire avec celui de la base de données, si ok , cette fois plutôt que de créer un ID de session, il va créer un Token qui sera vailde selon la periode de temps défini dans session() de 'server.js et contiendra: 
1- le username qui servira au server pour identifier l'utilisateur lors des prochaines requêtes. Un JWT ne contient jamais de mot de passe ! 
2- les autres informations nom sensibles.
Le mot de passe hashé restera côté serveur. Ainsi en cas de piratage du server, le pirate n'auras pas accès au nom d'utilisateur et au cas où quelqu'un aurait accès au navigateur, le pirate n'aura pas accès au mot de passe.
*/
/* Les JWT (Token) ont 2 avantages :
Rappel : Le token JWT est utilisé principalement pour l'authentification et la vérification de l'identité de l'utilisateur, et non pour stocker toutes les données de l'utilisateur.
      1- Chaque fois qu'un utilisateur se connecte, un nouveau JWT est généré avec une nouvelle date d'expiration. Cela limite la durée de validité d'un token, ce qui réduit le risque en cas de vol de token.
      2- Le token est signé et contient des informations minimales (username + infos non sensibles), permettant au serveur de vérifier l'identité sans requête supplémentaire. Seul le mot de passe reste dans le server et en cas de piratage, l'absence du username empêche le vol d'informations.
      3- Chaque connexion génère un nouveau token avec une nouvelle date d'expiration, limitant la durée de validité.
   Note : Le JWT est encodé en Base64, mais pas chiffré, donc ne jamais y mettre de données sensibles comme des mots de passe. */
router.post("/admin", async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body; // Ajouter rememberMe pour récupérer la valeur de la case à cocher
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Si l'authentification réussit, création d'un token JWT
    const expiresIn = rememberMe ? "1d" : "1h"; // Si "Se souvenir de moi" est coché, le token expire dans 7 jours, sinon dans 1h ( "7d" : "1h" )

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: expiresIn // La durée d'expiration du token est maintenant dynamique
    });

    // Si "se souvenir de moi" est activé, on crée un cookie persistant
    const cookieOptions = rememberMe
      ? { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 7 jours pour "Se souvenir de moi" :  maxAge: 7 * 24 * 60 * 60 * 1000
      : { httpOnly: true }; // Cookie de session (expire à la fermeture du navigateur)

    // Envoi du token sous forme de cookie HTTP-only
    res.cookie("token", token, cookieOptions);

    // Si "rememberMe" est coché, on ajoute une donnée dans la session
    if (rememberMe) {
      req.session.rememberMe = "A cliqué au moins une fois";
    }

    // Redirection vers le dashboard
    res.redirect("/blog/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error login");
  }
});

/**
 * GET  Admin - Dashboard
 **/
// *
// Donner l'accès au dashbord
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
      username: req.user.username, // Ajouter le username à locals
      rememberMe: req.session.rememberMe
    };

    const allowedStatuses = ["published", "draft", "archived"];
    const statusFilter = allowedStatuses.includes(req.query.status)
      ? req.query.status
      : "all";
    const query = statusFilter === "all" ? {} : { status: statusFilter };
    const data = await Post.find(query).sort({ createdAt: -1 });
    res.render("admin/dashboard", {
      locals,
      data,
      statusFilter,
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * GET  Admin - Create New Post Page
 **/
// *
// accès a la page "Créer un post"
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    };

    // const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST  Admin - Create New Post with Image Upload
 **/

router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    const publishOptions = {
      publishToX: req.body.publishToX === "on"
    };

    // 1) Vérifier l'image de bannière obligatoire
    if (!req.files || !req.files.bannerImage) {
      return res
        .status(400)
        .send("L'image de bannière est requise pour créer un post");
    }

    // 2) Traiter la bannière (existant dans ton code)
    const bannerImages = await processImage(req.files.bannerImage);

    // 3) Récupérer le body Markdown
    let finalBody = req.body.body;

    // 4) Déplacer les images d'illustration si nécessaire
    //    On cherche toutes les occurrences de "temp/nom-de-fichier" dans finalBody
    //    A) avec un RegEx
    const regex = /\/temp\/([^\s)]+)/g;
    // - /temp/ : littéral
    // - ([^\s)]+) : capture tout ce qui n’est pas un espace ou une parenthèse fermante, jusqu’à la fin du groupe

    // matchAll(...) renvoie un itérateur de tous les matchs
    const matches = [...finalBody.matchAll(regex)];

    // 4 bis) Créer un tableau pour stocker les chemins finaux
    const illustrationList = [];

    // Pour chaque correspondance trouvée, on va:
    //   - Extraire "nom-de-fichier" (capture group 1)
    //   - fs.rename du fichier 'public/temp/nom-de-fichier' -> 'public/uploads/nom-de-fichier'
    //   - Remplacer dans finalBody le "temp/nom-de-fichier" par "uploads/nom-de-fichier"
    for (const match of matches) {
      const fileName = match[1]; // "monFichier.webp", "xxxx.webp" etc.

      // Chemin absolu vers temp et uploads
      const tempPath = path.join(process.cwd(), "public", "temp", fileName);
      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName
      );

      try {
        // Déplacer physiquement
        await fs.rename(tempPath, uploadPath);
        console.log(`Fichier déplacé : ${fileName}`);
      } catch (err) {
        // Si le fichier n'existe pas, on peut ignorer ou logguer
        console.warn(
          `Impossible de déplacer ${fileName} depuis temp -> uploads :`,
          err
        );
      }

      // Réécrire le lien dans finalBody
      finalBody = finalBody.replaceAll(
        `/temp/${fileName}`,
        `/uploads/${fileName}`
      );

      // On enregistre ce chemin dans le tableau des illustrations
      // Ici, on stocke la version "/uploads/xxx.webp" (chemin relatif)
      illustrationList.push(`/uploads/${fileName}`);
    }

    // 5) Créer le post
    const slug = await createUniqueSlug(Post, req.body.title);
    const newPost = new Post({
      title: req.body.title,
      slug,
      description: req.body.description,
      body: finalBody,
      bannerImages,
      illustrationImages: illustrationList,
      ...getPostMetaFields(req.body)
    });

    await newPost.save();
    console.log("newPost.save :", newPost);
    await publishArticleToSelectedSocials(newPost, publishOptions);

    // 6) PING Google pour signaler la mise à jour du sitemap
    // try {
    //   const pingUrl =
    //     "https://www.google.com/ping?sitemap=https://mavitrineduweb.fr/sitemap.xml";
    //   await fetch(pingUrl);
    //   console.log("Ping Google Sitemap: succès !");
    // } catch (pingError) {
    //   console.error("Impossible de ping Google :", pingError);
    // }

    // 7) Rediriger
    res.redirect("/blog/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la création du post");
  }
});

/**
 * POST  Admin - Prévisualiser de add-post.ejs, un post en cours de création
 **/

router.post("/preview-addpost", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Preview Post",
      description: "Preview the post before adding."
    };

    const data = {
      title: req.body.title,
      description: req.body.description,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
      bannerAlt: req.body.bannerAlt,
      authorName: req.body.authorName,
      status: req.body.status,
      category: req.body.category,
      tags: parseTags(req.body.tags || ""),
      body: req.body.body,
      bannerImage: req.files.bannerImage,
      createdAt: new Date(),
      // sanitizedHtml: dompurify.sanitize(marked.parse(req.body.body))
      sanitizedHtml: dompurify.sanitize(renderMarkdown(req.body.body))
    };
    // console.log("Date de création (createdAt):", data.createdAt);
    // console.log("Type de createdAt:", typeof data.createdAt);
    // console.log("Valeur de createdAt:", data.createdAt);

    // Rendre la vue de prévisualisation
    res.render("admin/preview-post", {
      locals,
      data,
      layout: adminLayout
    });
  } catch (error) {
    console.error("Erreur lors de la prévisualisation du post :", error);
    res.status(500).send("Erreur lors de la prévisualisation du post");
  }
});

/**
 * GET  Admin - accéder au post à modifier
 **/
// *
// accéder à la page du post à modifier
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    };

    const data = await Post.findOne({ _id: req.params.id });
    console.log("data get edit-post / id :", data);

    // Récupérer tempBannerImage depuis la requête si disponible
    // const tempBannerImage = req.query.tempBannerImage || null;

    res.render("admin/edit-post", {
      locals,
      data: {
        ...data.toObject()
      },
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * PUT  Admin - Edit post
 **/
// *
// Modifier un post existant :
/* Part 10 du tuto, time 7.37 */
// router.put("/edit-post/:id", authMiddleware, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) {
//       return res.status(404).send("Post introuvable");
//     }

//     post.title = req.body.title;
//     post.description = req.body.description;
//     post.body = req.body.body;
//     post.updatedAt = Date.now();

//     if (req.files && req.files.bannerImage) {
//       await deletePostImages(post.bannerImages); // Suppression des anciennes images
//       const bannerImages = await processImage(req.files.bannerImage);
//       post.bannerImages = bannerImages;
//     }

//     await post.save();

// 3) (Optionnel) PING Google
// try {
//   const pingUrl =
//     "https://www.google.com/ping?sitemap=https://mavitrineduweb.fr/sitemap.xml";
//   await fetch(pingUrl);
//   console.log("Ping Google Sitemap: succès !");
// } catch (pingError) {
//   console.error("Impossible de ping Google :", pingError);
// }

//     res.redirect("/blog/dashboard");
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour du post :", error);
//     res.status(500).send("Erreur lors de la mise à jour du post");
//   }
// });

/* ------------------------------------------------------------------
 * PUT /edit-post/:id — mise à jour complète d’un post
 * ---------------------------------------------------------------- */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const publishOptions = {
      publishToX: req.body.publishToX === "on"
    };

    /* --------------------------------------------------------------
     * 1.  Charger le post existant
     * ------------------------------------------------------------- */
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post introuvable");
    const previousIllustrations = Array.isArray(post.illustrationImages)
      ? [...post.illustrationImages]
      : [];

    /* --------------------------------------------------------------
     * 2.  Bannière (remplace si nouvelle image)
     * ------------------------------------------------------------- */
    if (req.files?.bannerImage) {
      await deletePostImages(post.bannerImages); // nettoyage
      post.bannerImages = await processImage(req.files.bannerImage);
    }

    /* --------------------------------------------------------------
     * 3.  Champs simples
     * ------------------------------------------------------------- */
    post.title = req.body.title;
    if (!post.slug) {
      post.slug = await createUniqueSlug(Post, req.body.title, post._id);
    }
    post.description = req.body.description;
    Object.assign(post, getPostMetaFields(req.body));
    let finalBody = req.body.body; // on le retouchera plus bas
    post.updatedAt = Date.now();

    /* --------------------------------------------------------------
     * 4.  Illustrations  : déplacement + mise à jour des liens
     * ------------------------------------------------------------- */
    const regex = /(\/(temp|uploads)\/([^\s)]+))/g;
    const matches = [...finalBody.matchAll(regex)];

    const newIllustrations = []; // ✅ tableau final à enregistrer

    for (const [, fullPath, folder, fileName] of matches) {
      //   const relPath = `/${folder}/${fileName}`;
      //   const absPath = path.join(process.cwd(), "public", relPath);
      const absPath = path.join(process.cwd(), "public", fullPath);

      // 4-a → l’image référencée existe-t-elle encore ?
      if (!fsSync.existsSync(absPath)) continue; // lien cassé : on ignore

      // 4-b → si elle est encore dans /temp on la déplace
      if (folder === "temp") {
        const dest = path.join(process.cwd(), "public", "uploads", fileName);
        await fs.rename(absPath, dest);
        finalBody = finalBody.replaceAll(
          `/temp/${fileName}`,
          `/uploads/${fileName}`
        );
      }

      // 4-c → on empile uniquement des chemins valides en /uploads
      newIllustrations.push(`/uploads/${fileName}`);
    }

    /* --------------------------------------------------------------
     * 5.  Enregistrer dans le document puis sauvegarder
     * ------------------------------------------------------------- */
    post.body = finalBody;
    post.illustrationImages = newIllustrations;
    await post.save();

    const keptIllustrations = new Set(newIllustrations);
    const removedIllustrations = previousIllustrations.filter(
      (imagePath) => !keptIllustrations.has(imagePath)
    );
    await Promise.all(removedIllustrations.map(deletePublicImageIfExists));

    await publishArticleToSelectedSocials(post, publishOptions);

    /* --------------------------------------------------------------
     * 6.  Fin — on revient au dashboard
     * ------------------------------------------------------------- */
    res.redirect("/blog/dashboard");
  } catch (err) {
    console.error("Erreur update :", err);
    res.status(500).send("Erreur lors de la mise à jour du post");
  }
});

/**
 * POST Admin - Preview Post de edit-post.ejs, un post en modification
 **/
router.post("/preview-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Preview Post",
      description: "Preview the post before updating."
    };

    // Récupérer le post existant pour obtenir les images actuelles
    // const post = await Post.findById(req.body.postId);

    const post = await Post.findById(req.params.id);
    // console.log("post :", post);

    if (!post) {
      return res.status(404).send("Post introuvable");
    }

    const data = {
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
      bannerAlt: req.body.bannerAlt,
      authorName: req.body.authorName,
      status: req.body.status,
      category: req.body.category,
      tags: parseTags(req.body.tags || ""),
      body: req.body.body,
      bannerImage: post.bannerImages.ImgBase,
      createdAt: post.createdAt, // Conserver la date de création
      sanitizedHtml: dompurify.sanitize(renderMarkdown(req.body.body))
    };
    // console.log("data.bannerImage :", data.bannerImage);

    // Rendre la vue de prévisualisation
    res.render("admin/preview-post", {
      locals,
      data,
      layout: adminLayout
    });
  } catch (error) {
    console.error("Erreur lors de la prévisualisation du post :", error);
    res.status(500).send("Erreur lors de la prévisualisation du post");
  }
});

/**
 * DELETE  Admin - Delete Post
 **/
// *
/* Part 10 du tuto, time 7.37
https://chatgpt.com/share/673e1cd8-ea44-800d-b7e7-a84618775dac */

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post introuvable");
    }
    // Supprimer la bannière (si tu as déjà un helper "deletePostImages" pour bannerImages)
    await deletePostImages(post.bannerImages);

    // Supprimer les images d'illustration
    for (const illustPath of post.illustrationImages) {
      // ex: illustPath = "/uploads/61743966041178-youtube-thumbnail-2-2.webp"
      const absolutePath = path.join(process.cwd(), "public", illustPath);
      try {
        await fs.unlink(absolutePath);
        console.log(`Image d'illustration supprimée : ${illustPath}`);
      } catch (err) {
        console.warn(`Impossible de supprimer ${illustPath} :`, err);
      }
    }
    // Supprimer le post de la base de données
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/blog/dashboard");
  } catch (error) {
    // console.error("Erreur lors de la suppression du post :", error);
    res.status(500).send("Erreur lors de la suppression du post");
  }
});

/**
 * GET  Admin - Logout
 **/
// *
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  // res.json({ message: "Logout successful." });
  res.redirect("/blog");
});

export default router;

// Ajouter une image d'illustration
router.post("/upload-illustration", authMiddleware, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "Aucune image fournie." });
    }

    const imageUrl = await processIllustrationImage(req.files.image);

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Erreur d'upload d'illustration :", error);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

/**
 *  SUPPRIMER une image — qu’elle soit encore dans /temp
 *  ou déjà dans /uploads. Appel AJAX depuis editor.js
 *  Corps JSON : { url: "https://…/temp/xx.webp" | "https://…/uploads/yy.webp" }
 */
// 🔄 route /delete-image  — accepte absolu *ou* relatif
router.post("/delete-image", authMiddleware, async (req, res) => {
  try {
    const { url } = req.body; // ex : "/uploads/aaa.webp"
    if (!url) return res.json({ success: false });
    console.log("url :", url);

    /* ----------------------------------------------------------
     * 1. Convertir en chemin « relatif » commençant par /temp/...
     *    – si url absolue  → on garde .pathname
     *    – si url déjà relative → on la prend telle quelle
     * --------------------------------------------------------- */
    let relPath;
    try {
      // URL absolue (http://…)
      relPath = new URL(url).pathname; // "/uploads/aaa.webp"
    } catch {
      // Pas de protocole : on suppose déjà relatif
      relPath = url.startsWith("/") ? url : `/${url}`;
    }
    console.log("relPath :", relPath);

    // 2. Sécurité : uniquement /temp/ ou /uploads/
    if (!relPath.startsWith("/temp/") && !relPath.startsWith("/uploads/"))
      return res.json({ success: false });

    // 3. Chemin absolu sur le disque
    const abs = path.join(process.cwd(), "public", relPath);
    console.log(" abs :", abs);

    await fs.unlink(abs); // suppression fichier
    return res.json({ success: true });
  } catch (err) {
    console.warn("delete-image :", err.message);
    return res.json({ success: false });
  }
});
