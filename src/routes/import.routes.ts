import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middlewares/auth.middleware';
import * as importController from '../controllers/import.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate as never);

/**
 * @swagger
 * tags:
 *   name: Import
 *   description: Import de données
 */

/**
 * @swagger
 * /import/articles:
 *   post:
 *     summary: Importer des articles depuis un fichier JSON
 *     tags: [Import]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Fichier JSON contenant un tableau d'articles
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Import terminé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: integer
 *                   description: Nombre d'articles importés
 *                 failed:
 *                   type: integer
 *                   description: Nombre d'articles en échec
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Fichier invalide ou erreurs d'import
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/articles', upload.single('file'), importController.importArticles as never);

export default router;
