import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as notificationService from '../services/notification.service';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit } = req.query;
    const result = await notificationService.getNotifications(
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur serveur';
    res.status(500).json({ message });
  }
};
