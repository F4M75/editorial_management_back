# Editorial Management — Back-end

## Description

API REST de gestion éditoriale permettant de gérer des articles, catégories, réseaux et utilisateurs. Elle inclut un système d'authentification JWT, un import d'articles depuis JSON, l'envoi de notifications email via template HTML et une documentation interactive Swagger.

## Prérequis

- Node.js >= 20.x
- npm >= 10.x

## Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd editorial_management_back

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Appliquer les migrations et générer le client Prisma
npx prisma migrate dev

# Créer un utilisateur administrateur par défaut
npm run seed
```

## Lancement

```bash
# Développement (hot reload)
npm run dev

# Production
npm run build
npm start
```

L'API est disponible sur `http://localhost:4000/api`
La documentation Swagger est disponible sur `http://localhost:4000/api-docs`

Identifiants par défaut après le seed :

- **Email** : `admin@editorial.com`
- **Mot de passe** : `admin123`

## Choix techniques

- **Express.js** — framework HTTP minimaliste, largement adopté et facile à structurer en couches controller/service/route
- **TypeScript** — typage statique pour fiabiliser le code et améliorer l'expérience de développement
- **Prisma 7** — ORM type-safe avec migrations automatiques, adapté à SQLite pour un démarrage rapide sans infrastructure
- **SQLite** — base de données embarquée, sans configuration serveur, idéale pour un projet local ou un prototype
- **JWT (jsonwebtoken)** — authentification stateless, simple à intégrer et adaptée à une API REST
- **Zod** — validation des données en entrée avec des schémas TypeScript-first, messages d'erreur structurés
- **Nodemailer** — envoi d'emails SMTP avec fallback console si le serveur SMTP n'est pas configuré
- **Swagger (swagger-jsdoc + swagger-ui-express)** — documentation auto-générée depuis les annotations JSDoc des routes
- **Multer** — gestion de l'upload de fichiers pour l'import JSON d'articles
- **Architecture en couches** (routes → controllers → services) — séparation des responsabilités, facilité de test et de maintenance

**Compromis effectués :**

- SQLite ne supportant pas les tableaux natifs, le champ `recipients` de `EmailNotification` est stocké en JSON stringifié
- Pas de refresh token implémenté (token JWT à durée fixe uniquement)
- Pas de tests automatisés faute de temps

## Fonctionnalités implémentées

| Fonctionnalité                             | Statut                                                |
| ------------------------------------------ | ----------------------------------------------------- |
| Authentification JWT (login)               | ✅ Complet                                            |
| Gestion des articles (CRUD)                | ✅ Complet                                            |
| Pagination et filtres avancés des articles | ✅ Complet                                            |
| Changement de statut d'article             | ✅ Complet                                            |
| Gestion des catégories (CRUD)              | ✅ Complet                                            |
| Gestion des réseaux (liste)                | ✅ Complet                                            |
| Notifications email avec template HTML     | ✅ Complet                                            |
| Historique des notifications               | ✅ Complet                                            |
| Import d'articles depuis JSON              | ✅ Complet                                            |
| Validation des données (Zod)               | ✅ Complet                                            |
| Documentation Swagger                      | ✅ Complet                                            |
| Gestion des utilisateurs (CRUD)            | ⬜ Non fait                                           |
| Refresh token                              | ⬜ Non fait                                           |
| Tests unitaires / d'intégration            | ⬜ Non fait                                           |
| Gestion des rôles (admin/editor)           | 🔶 Partiel (rôle stocké, non appliqué sur les routes) |

## Ce qui aurait été fait avec plus de temps

1. **Tests** — tests unitaires des services avec Jest et tests d'intégration des routes avec Supertest
2. **Gestion des rôles** — middleware de contrôle d'accès basé sur le rôle (ex : seul un admin peut supprimer un article)
3. **Refresh token** — mécanisme de renouvellement de token sans reconnexion
4. **CRUD utilisateurs** — endpoints pour créer, modifier, désactiver des comptes
5. **Rate limiting** — protection contre les abus avec `express-rate-limit`
6. **Logging structuré** — intégration de `winston` ou `pino` pour des logs exploitables en production
7. **Variables d'environnement typées** — validation du `.env` au démarrage avec Zod pour éviter les erreurs silencieuses
8. **Conteneurisation** — Dockerfile et docker-compose pour faciliter le déploiement
9. **CI/CD** — pipeline GitHub Actions pour lint, build et tests automatiques

## Tests

Aucun test automatisé n'est implémenté pour le moment.

```bash
# Commande prévue (non fonctionnelle)
npm test
```

## Difficultés rencontrées

- **Prisma 7 — rupture de l'API** : la version 7 de Prisma a supprimé la propriété `url` du fichier `schema.prisma` et exige désormais un driver adapter (`@prisma/adapter-libsql`) pour SQLite. La documentation étant encore partielle sur ce changement, cela a nécessité une exploration du code généré pour identifier la bonne configuration.
- **Types TypeScript avec Express 5** : Express 5 introduit des changements de types sur les handlers, nécessitant des casts `as never` sur les routes utilisant un type `Request` étendu (`AuthRequest`).
