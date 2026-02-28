import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as importService from '../services/import.service';

export const importArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let rows: unknown[];

    if (req.file) {
      try {
        rows = JSON.parse(req.file.buffer.toString('utf-8')) as unknown[];
      } catch {
        res.status(400).json({ message: 'Fichier JSON invalide' });
        return;
      }
    } else if (Array.isArray(req.body)) {
      rows = req.body as unknown[];
    } else {
      res.status(400).json({ message: 'Fournir un fichier JSON ou un tableau JSON dans le body' });
      return;
    }

    const result = await importService.importArticles(rows);
    const status = result.failed > 0 && result.success === 0 ? 400 : 201;
    res.status(status).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur serveur';
    res.status(400).json({ message });
  }
};
