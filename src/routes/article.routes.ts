import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as articleController from '../controllers/article.controller';

const router = Router();

router.use(authenticate as never);

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Gestion des articles
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Liste paginée des articles avec filtres
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *         description: Filtrer par statut
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filtrer les articles mis en avant
 *       - in: query
 *         name: networkId
 *         schema:
 *           type: string
 *         description: Filtrer par réseau
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filtrer par auteur
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche dans le titre, l'extrait et le contenu
 *     responses:
 *       200:
 *         description: Liste paginée d'articles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedArticles'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', articleController.getArticles as never);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Détail d'un article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détail de l'article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', articleController.getArticleById as never);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Créer un article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Article créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/', articleController.createArticle as never);

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Modifier un article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       200:
 *         description: Article modifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', articleController.updateArticle as never);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Article supprimé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', articleController.deleteArticle as never);

/**
 * @swagger
 * /articles/{id}/status:
 *   patch:
 *     summary: Changer le statut d'un article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Statut invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/status', articleController.changeStatus as never);

/**
 * @swagger
 * /articles/{id}/notify:
 *   post:
 *     summary: Envoyer une notification email pour un article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipients, subject]
 *             properties:
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *                 example: ["user@example.com"]
 *               subject:
 *                 type: string
 *                 example: "Nouvel article publié"
 *     responses:
 *       201:
 *         description: Notification envoyée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailNotification'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/notify', articleController.notifyArticle as never);

export default router;
