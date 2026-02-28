import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as statsController from '../controllers/stats.controller';

const router = Router();

router.use(authenticate as never);

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Statistiques du tableau de bord
 */

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Statistiques globales pour le dashboard
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques globales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     draft:
 *                       type: integer
 *                     published:
 *                       type: integer
 *                     archived:
 *                       type: integer
 *                 byNetwork:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 byCategory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       color:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 recentArticles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 recentNotifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmailNotification'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', statsController.getStats as never);

export default router;
