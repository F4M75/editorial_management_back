import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as statsService from '../services/stats.service';

export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await statsService.getStats();
    res.json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur serveur';
    res.status(500).json({ message });
  }
};
