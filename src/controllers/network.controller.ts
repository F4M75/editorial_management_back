import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as networkService from '../services/network.service';

export const getNetworks = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const networks = await networkService.getNetworks();
    res.json(networks);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur serveur';
    res.status(500).json({ message });
  }
};
