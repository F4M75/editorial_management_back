import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(400).json({ message: 'Email et mot de passe requis' });
      return;
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur serveur';
    res.status(401).json({ message });
  }
};
