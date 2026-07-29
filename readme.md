# MVDW — Utilisation locale avec Docker

Le projet **Ma Vitrine Du Web (MVDW)** fonctionne désormais en local dans un **conteneur Docker**.

Docker permet au projet de continuer à utiliser sa version prévue de Node.js dans un environnement isolé, même si la version de Node installée directement sur Windows évolue.

MongoDB n’est pas placé dans Docker : le conteneur MVDW se connecte à la base locale **MVDW-Blog2** exécutée sur Windows.

## Changement important

Quand le projet est utilisé avec Docker, il est nécessaire d'ouvrir Docker Desktop avant de lancer toutes commandes dans Vscode. Les anciennes commandes lancées directement avec Node qui était:

```bash
npm run start
npm run dev
```

sont remplacées par des commandes Docker.

Le terminal intégré de VS Code reste utilisé normalement.

---

## Démarrer MVDW avec Express + Vite

```bash
npm run start
```

Est remplacée par le commande Docker :

```bash
docker compose up
```

Elle démarre le conteneur et exécute automatiquement :

```bash
npm run start
```

à l’intérieur de Docker.

Le site est ensuite accessible à l’adresse :

```text
http://localhost:5001
```

Les messages connexion / erreur du serveur restent visibles dans le terminal de VS Code.

### Arrêter le serveur

Comme auparavant, utiliser :

```text
Ctrl + C
```

Pour arrêter et supprimer proprement le conteneur Compose après cela :

```bash
docker compose down
```

---

## Démarrer uniquement la partie Vite dans docker

```bash
npm run dev
```

Est remplacée par la commande Docker :

```bash
docker compose run --rm --service-ports mvdw npm run dev -- --host 0.0.0.0
```

Le site Vite est ensuite accessible à l’adresse :

```text
http://localhost:5173
```

L’option :

```text
--host 0.0.0.0
```

est nécessaire pour que le serveur Vite lancé dans le conteneur soit accessible depuis le navigateur Windows.

### Arrêter Vite

Utiliser :

```text
Ctrl + C
```

L’option `--rm` supprime automatiquement ce conteneur temporaire après son arrêt.

---

## Premier démarrage ou reconstruction

Lors du premier lancement, ou après une modification du `Dockerfile`, de `package.json` ou de `package-lock.json`, utiliser :

```bash
docker compose up --build
```

Cette commande reconstruit l’image Docker avant de démarrer MVDW.

---

## Démarrer en arrière-plan

Pour lancer le projet sans garder les logs ouverts dans le terminal :

```bash
docker compose up -d
```

Le terminal redevient immédiatement disponible.

Pour consulter ensuite les logs :

```bash
docker compose logs -f
```

Dans ce cas, `Ctrl + C` ferme seulement l’affichage des logs. Le conteneur continue de fonctionner.

Pour arrêter le projet :

```bash
docker compose down
```

---

## Résumé des commandes

| Besoin                                    | Ancienne commande | Commande avec Docker                                                         |
| ----------------------------------------- | ----------------- | ---------------------------------------------------------------------------- |
| Démarrer Express et le site compilé       | `npm run start`   | `docker compose up`                                                          |
| Démarrer uniquement Vite                  | `npm run dev`     | `docker compose run --rm --service-ports mvdw npm run dev -- --host 0.0.0.0` |
| Premier démarrage ou reconstruction       | —                 | `docker compose up --build`                                                  |
| Démarrer en arrière-plan                  | —                 | `docker compose up -d`                                                       |
| Voir les logs                             | —                 | `docker compose logs -f`                                                     |
| Arrêter depuis le terminal actif          | `Ctrl + C`        | `Ctrl + C`                                                                   |
| Arrêter et supprimer le conteneur Compose | —                 | `docker compose down`                                                        |

## Fonctionnement général

```text
Terminal VSCode sous Windows
        │
        └── commande Docker
                │
                └── conteneur Linux MVDW
                        │
                        ├── Node.js 18.18.0
                        ├── Express sur le port 5001
                        ├── Vite sur le port 5173 lorsque demandé
                        └── connexion à MongoDB sur Windows
```

Git, Sourcetree, VS Code et Codex continuent d’être utilisés directement depuis Windows. La présence de Docker ne change pas le fonctionnement des commits, des push vers GitHub ni le déploiement habituel sur Render.

---

## Faut-il supprimer le conteneur après chaque utilisation ?

Pas forcément.

Pour les modifications de code classiques — par exemple HTML, CSS, JavaScript ou contenu du projet — il est tout à fait acceptable d’arrêter le serveur avec :

```text
Ctrl + C
```

puis de fermer VSCode et Docker Desktop.

Le lendemain, il suffit de relancer Docker Desktop, d’ouvrir VS Code, puis d’exécuter :

```bash
docker compose up
```

Docker peut alors réutiliser le conteneur déjà créé.

Tu peux retenir cette règle simple :

```text
Modifications de code classiques
→ Ctrl + C
→ docker compose up le lendemain
```

En revanche, si la configuration Docker elle-même a changé, il est préférable de supprimer puis reconstruire le conteneur :

```text
Modification de la configuration Docker
→ docker compose down
→ docker compose up --build
```

Cela concerne notamment les modifications de :

- `Dockerfile`
- `compose.yaml`
- `package.json`
- `package-lock.json`
- ports
- volumes
- variables d’environnement
- commande de démarrage

Dans l’usage quotidien, réutiliser le conteneur est donc parfaitement acceptable. Un nouveau conteneur est surtout utile lorsque l’environnement Docker lui-même a changé. 🐳

---

## Démarrage en arrière-plan

La commande :

```bash
docker compose up -d
```

démarre MVDW en arrière-plan. L’option `-d` signifie _detached_ : le conteneur continue de fonctionner, mais les logs ne restent pas affichés dans le terminal.

Le terminal redevient immédiatement disponible pour d’autres commandes.

Pour afficher ensuite les logs en direct :

```bash
docker compose logs -f
```

Dans ce cas, `Ctrl + C` ferme seulement l’affichage des logs. Le conteneur continue de fonctionner.

Pour arrêter complètement MVDW :

```bash
docker compose down
```

### Quel mode utiliser au quotidien ?

Pour le développement de MVDW, le mode le plus adapté est :

```bash
docker compose up
```

Il laisse les logs visibles dans le terminal, ce qui permet de repérer immédiatement :

- les erreurs Node ou Express ;
- les erreurs MongoDB ;
- les erreurs déclenchées par une route ;
- les messages ajoutés avec `console.log()` ;
- les problèmes de démarrage du serveur.

Le démarrage en arrière-plan est surtout utile lorsqu’on veut laisser MVDW tourner longtemps sans surveiller le terminal.

Règle conseillée :

```text
Pour développer et surveiller les erreurs
→ docker compose up
```

```text
Pour laisser MVDW tourner sans surveiller le terminal
→ docker compose up -d
```

Dans l’usage habituel de MVDW, `docker compose up` reste donc la commande recommandée.
