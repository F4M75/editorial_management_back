import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { importArticlesSchema } from '../utils/schemas';
import * as importService from '../services/import.service';

export const importArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let rawRows: unknown;

    if (req.file) {
      try {
        rawRows = JSON.parse(req.file.buffer.toString('utf-8'));
      } catch {
        res.status(400).json({ message: 'Fichier JSON invalide' });
        return;
      }
    } else if (req.body) {
      rawRows = req.body;
    } else {
      res.status(400).json({ message: 'Fournir un fichier JSON ou un tableau JSON dans le body' });
      return;
    }

    const parsed = importArticlesSchema.safeParse(rawRows);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(400).json({ message: 'Données invalides', errors });
      return;
    }

    const result = await importService.importArticles(parsed.data);
    const status = result.failed > 0 && result.success === 0 ? 400 : 201;
    res.status(status).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur serveur';
    res.status(400).json({ message });
  }
};
