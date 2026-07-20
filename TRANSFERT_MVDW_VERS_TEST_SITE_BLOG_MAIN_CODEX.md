# Prompt de transfert vers `test-site-blog-main - CODEX`

Copie-colle le prompt ci-dessous dans une nouvelle demande Codex ouverte dans le projet :

`C:\Users\40mru\Documents\CODEUR\test-site-blog-main - CODEX`

---

## Prompt à transmettre

Tu es dans le projet `test-site-blog-main - CODEX`. Je veux que tu reproduises les modifications validées récemment dans le projet source `mvdw`, sans faire de commit ni de push tant que je ne te l'ai pas explicitement demandé.

Projet source :

`C:\Users\40mru\Documents\CODEUR\mvdw`

Commits source à prendre comme référence :

- `e28e490` : `modofs cartes services en page d'accueil. modif liens footer.`
- `e921f27` : `modif d'harmonisation global du design + carte éducation commentée`

Objectif : appliquer dans `test-site-blog-main - CODEX` les mêmes changements fonctionnels et visuels, en respectant la structure réelle du projet cible.

À transférer depuis `mvdw` :

1. Page d'accueil `index.html`
   - Remplacer les libellés de navigation :
     - `Home` -> `Accueil`
     - `Prix` -> `Tarifs`
     - `Formules & Prix` -> `Formules & Tarifs`
   - Dans les cartes services de la page d'accueil, commenter les paragraphes descriptifs des cartes pour ne conserver visuellement que l'icône et le titre.
   - Commenter la section `#etapes` si elle existe encore dans le projet cible.
   - Mettre à jour les liens du footer :
     - `Contact`
     - `Services`
     - `Tarifs`
     - `Le Blog`
   - Commenter entièrement la carte de thème contenant le lien :
     `https://keerti1924.github.io/E-Learning-Website-HTML-CSS/index.html`
     La carte doit rester dans le code en commentaire HTML, mais ne doit plus apparaître dans le DOM actif.

2. Page `services.html`
   - Harmoniser les libellés de navigation :
     - `Home` -> `Accueil`
     - `Formules` ou `Prix` -> `Tarifs`
   - Mettre à jour les liens du footer comme dans `mvdw` :
     - `Accueil`
     - `Contact`
     - `Tarifs`
     - `Le Blog`

3. Page `tarifs.html`
   - Harmoniser les libellés de navigation :
     - `Home` -> `Accueil`
     - `Prix` -> `Tarifs`
   - Déplacer le bloc explicatif "Combien coûte un site internet ?" dans l'introduction de la page, avant la section des cartes tarifaires.
   - Dans la section `#prix`, remplacer l'ancien bloc `.pricing-headline` par un titre pleine largeur :
     ```html
     <h2 class="pricing-boxes-title">
       <span>Tarifs selon le type de site :</span>
     </h2>
     ```
   - Mettre à jour le footer :
     - `Accueil`
     - `Contact`
     - `Services`
     - `Le Blog`

4. Styles `src/styles/style.css`
   - Harmoniser les transitions globales :
     - `background-color 120ms ease`
     - `color 120ms ease`
   - Ajouter/mettre à jour la variable :
     - `--background-pricing-div: #303336`
   - Ajuster la section de présentation :
     - largeur max plus contenue pour `.presentation2`
     - styles de `.hye-title2` plus lisibles
     - `.hye-propos` avec taille fluide, poids 400 et `line-height: 1.7`
     - liens `.presentation2 a.hye-propos` soulignés et hover bleu `#00a3ff`
   - Reprendre la nouvelle grille des cartes services :
     - grille 2 colonnes par défaut
     - 1 colonne sous 360px
     - 3 colonnes à partir de 1200px
     - 4 colonnes à partir de 1920px
     - cartes plus compactes, centrées, avec `border-radius: 8px`
     - icônes services en 72px, puis 88px, puis 100px selon breakpoints
     - inversion des icônes en thème inversé via `.root-inverted .div-img-service img`
   - Harmoniser la section pricing :
     - `.pricing` avec fond anthracite et radius
     - `.pricing-boxes` avec `row-gap`, padding latéral et `width: 100%`
     - nouveau style `.pricing-boxes-title` et `.pricing-boxes-title span`
     - bordure blanche des `.pricing-box` en thème inversé
     - liens de `.pricing-headline h2 a` blancs sans soulignement
   - Harmoniser les liens footer :
     - taille autour de `1.1rem`
     - `font-weight: 500`
     - hover/focus bleu `#00a3ff`, sans opacité réduite
   - Réduire les marges du formulaire contact :
     - inputs : `margin: 15px 0`
     - textarea : `margin-top: 15px`, `margin-bottom: 15px`
   - Ajouter les styles spécifiques à `.pricing-page-intro .presentation` si la page tarifs utilise cette classe.

5. Styles `src/styles/services.css`
   - Harmoniser le hero services :
     - titre moins serré, `letter-spacing: 0`, `line-height: 1.05`, `max-width: 11ch`
     - texte plus lisible, `line-height: 1.65`
     - contenu centré, largeur `100%`
   - Ajouter le media query portrait pour le hero services.
   - Ajouter `.section-heading--first` avec padding haut et correction du pseudo-élément.
   - Harmoniser les paragraphes `.services-intro-content p`.
   - Harmoniser les liens footer comme dans `style.css`.

6. Script `src/js/nav.js`
   - Ajouter le comportement qui permet à un lien vers la même page sans hash de remonter en haut avec le smooth scroll.
   - Gérer les liens `#` vides en remontant aussi en haut.

7. `.gitignore`
   - Vérifier que `public/uploads/*` est ignoré.
   - Garder l'exception `!public/uploads/.gitkeep`.
   - Nettoyer uniquement les commentaires temporaires inutiles si présents.

Méthode demandée :

- Commence par inspecter l'état Git du projet cible.
- Compare les fichiers du projet cible avec ceux du projet source avant d'éditer.
- N'écrase pas aveuglément les fichiers : adapte les changements à la structure réelle de `test-site-blog-main - CODEX`.
- Utilise `apply_patch` pour les modifications manuelles.
- Après modification, lance le build Vite si le projet le permet.
- Si le projet cible est servi via `dist`, vérifie que `dist/index.html` ne contient plus la carte Éducation dans le DOM actif après build.
- Donne-moi ensuite un résumé précis des fichiers modifiés et des vérifications effectuées.
- Ne fais pas de commit.
- Ne fais pas de push.

Message de commit à utiliser plus tard si je te le demande :

`modif d'harmonisation global du design + carte éducation commentée`

---

## Notes

Dans `mvdw`, le commit le plus récent concerné est :

`e921f27db45bcf5dd68b554e4d696b30c48f5b8c`

Il inclut notamment la carte Éducation commentée dans `index.html` et des harmonisations CSS sur `style.css`, `services.css` et `tarifs.html`.

Le commit précédent concerné est :

`e28e490f8dae4ecaf8c90ac00ca9ddc7db490304`

Il inclut notamment les modifications des cartes services de la page d'accueil, les libellés de navigation/footer, `src/js/nav.js`, `services.html`, `tarifs.html`, `style.css` et `services.css`.
