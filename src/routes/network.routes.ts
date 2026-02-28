import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as networkController from '../controllers/network.controller';

const router = Router();

router.use(authenticate as never);

/**
 * @swagger
 * tags:
 *   name: Networks
 *   description: Gestion des réseaux
 */

/**
 * @swagger
 * /networks:
 *   get:
 *     summary: Liste complète des réseaux
 *     tags: [Networks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réseaux
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Network'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', networkController.getNetworks as never);

export default router;
