# Transfert vers projet test - retrait noindex et featured

Projet source : `C:\Users\40mru\Documents\CODEUR\mvdw`

Projet cible : `C:\Users\40mru\Documents\CODEUR\test-site-blog-main - CODEX`

## Objectif

Reporter dans le projet de test la suppression validée dans le projet réel `mvdw` :

- suppression du champ `noindex` ;
- suppression du champ `featured`.

Ces deux champs ne doivent plus être présents dans :

- les formulaires admin ;
- le modèle `Post` ;
- les helpers de métadonnées ;
- le layout public du Blog ;
- tout autre fichier actif du projet.

L'objectif final est que les deux projets aient le même comportement et le même code utile sur ce point.

## Fichiers concernés

Comparer puis modifier au minimum :

- `views/admin/add-post.ejs`
- `views/admin/edit-post.ejs`
- `server/models/Post.js`
- `server/utils/postMeta.js`
- `views/layouts/main.ejs`

Faire ensuite une recherche globale pour vérifier qu'il ne reste aucune occurrence active de :

```txt
noindex
featured
```

hors `node_modules`, `dist` et `.git`.

## Modifications à appliquer

### 1. `views/admin/add-post.ejs`

Supprimer le bloc :

```html
<label>
  <input type="checkbox" name="noindex" />
  Ne pas indexer cet article
</label>

<label>
  <input type="checkbox" name="featured" />
  Mettre cet article en avant
</label>
```

### 2. `views/admin/edit-post.ejs`

Supprimer le bloc :

```html
<label>
  <input type="checkbox" name="noindex" <%= data.noindex ? "checked" : "" %> />
  Ne pas indexer cet article
</label>

<label>
  <input type="checkbox" name="featured" <%= data.featured ? "checked" : "" %> />
  Mettre cet article en avant
</label>
```

### 3. `server/models/Post.js`

Supprimer du schéma Mongoose :

```js
noindex: {
  type: Boolean,
  default: false
},
featured: {
  type: Boolean,
  default: false
},
```

### 4. `server/utils/postMeta.js`

Dans `getPostMetaFields(body)`, supprimer :

```js
noindex: body.noindex === "on",
featured: body.featured === "on"
```

Le dernier champ retourné doit rester syntaxiquement valide, par exemple :

```js
canonicalUrl: body.canonicalUrl || ""
```

### 5. `views/layouts/main.ejs`

Supprimer le rendu conditionnel :

```ejs
<% if (data.noindex) { %>
<meta name="robots" content="noindex, follow" />
<% } %>
```

## Vérifications attendues

Lancer :

```txt
rg -n "noindex|featured" -g "!node_modules/**" -g "!dist/**" -g "!.git/**" .
```

Résultat attendu : aucune occurrence.

Vérifier la syntaxe :

```txt
node --check server/models/Post.js
node --check server/utils/postMeta.js
node --check server/routes/admin.js
```

Si `node` n'est pas dans le PATH, utiliser le runtime Node disponible dans l'environnement Codex.

Ne pas lancer :

- `npm run dev`
- `vite preview`
- serveur Python

Ne pas écrire en base MongoDB.

## Prompt à utiliser dans le projet test

```text
Lis d'abord le fichier TRANSFERT_TEST_RETRAIT_NOINDEX_FEATURED.md.

Objectif : retirer du projet test `test-site-blog-main - CODEX` les champs noindex et featured, comme cela vient d'être validé dans le projet réel mvdw, afin d'aligner les deux projets.

Contraintes :
- compare l'état actuel avec le fichier de transfert avant modification ;
- ne lance pas npm run dev ;
- ne lance pas vite preview ;
- ne lance pas de serveur Python ;
- ne fais aucun test d'écriture MongoDB ;
- montre les diffs importants après modification.

Travail à faire :
1. Supprimer les checkboxes noindex et featured de views/admin/add-post.ejs.
2. Supprimer les checkboxes noindex et featured de views/admin/edit-post.ejs.
3. Supprimer noindex et featured du schéma server/models/Post.js.
4. Supprimer noindex et featured de getPostMetaFields dans server/utils/postMeta.js.
5. Supprimer dans views/layouts/main.ejs le rendu conditionnel de la balise robots noindex.
6. Chercher globalement noindex|featured hors node_modules, dist et .git pour vérifier qu'il ne reste aucune occurrence.
7. Faire les vérifications de syntaxe utiles avec node --check.

Après modification, résume les fichiers modifiés et confirme que noindex et featured ne sont plus présents dans le projet test.
```
