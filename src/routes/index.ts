import { Router } from 'express';
import authRoutes from './auth.routes';
import articleRoutes from './article.routes';
import categoryRoutes from './category.routes';
import networkRoutes from './network.routes';
import importRoutes from './import.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/networks', networkRoutes);
router.use('/import', importRoutes);
router.use('/notifications', notificationRoutes);

export default router;
