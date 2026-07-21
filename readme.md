# MVDW — Utilisation locale avec Docker

Le projet **Ma Vitrine Du Web (MVDW)** fonctionne désormais en local dans un **conteneur Docker**.

Docker permet au projet de continuer à utiliser sa version prévue de Node.js dans un environnement isolé, même si la version de Node installée directement sur Windows évolue.

MongoDB n’est pas placé dans Docker : le conteneur MVDW se connecte à la base locale **MVDW-Blog2** exécutée sur Windows.

## Changement important

Quand le projet est utilisé avec Docker, les anciennes commandes lancées directement avec Node :

```bash
npm run start
npm run dev
```

sont remplacées par des commandes Docker.

Le terminal intégré de VS Code reste utilisé normalement.

---

## Démarrer MVDW avec Express

Cette commande remplace :

```bash
npm run start
```

Commande Docker :

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

Les messages du serveur restent visibles dans le terminal de VS Code.

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

## Démarrer uniquement la partie Vite

Cette commande remplace :

```bash
npm run dev
```

Commande Docker :

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

| Besoin | Ancienne commande | Commande avec Docker |
|---|---|---|
| Démarrer Express et le site compilé | `npm run start` | `docker compose up` |
| Démarrer uniquement Vite | `npm run dev` | `docker compose run --rm --service-ports mvdw npm run dev -- --host 0.0.0.0` |
| Premier démarrage ou reconstruction | — | `docker compose up --build` |
| Démarrer en arrière-plan | — | `docker compose up -d` |
| Voir les logs | — | `docker compose logs -f` |
| Arrêter depuis le terminal actif | `Ctrl + C` | `Ctrl + C` |
| Arrêter et supprimer le conteneur Compose | — | `docker compose down` |

## Fonctionnement général

```text
Terminal VS Code sous Windows
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
