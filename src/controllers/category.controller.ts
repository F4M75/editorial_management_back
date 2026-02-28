import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as categoryService from '../services/category.service';

const handleError = (res: Response, err: unknown) => {
  const message = err instanceof Error ? err.message : 'Erreur serveur';
  const status = message === 'Catégorie non trouvée' ? 404 : 500;
  res.status(status).json({ message });
};

export const getCategories = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (err) {
    handleError(res, err);
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, description, color } = req.body as {
      name: string;
      slug: string;
      description: string;
      color: string;
    };
    if (!name || !slug || !description || !color) {
      res.status(400).json({ message: 'name, slug, description et color sont requis' });
      return;
    }
    const category = await categoryService.createCategory({ name, slug, description, color });
    res.status(201).json(category);
  } catch (err) {
    handleError(res, err);
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = await categoryService.updateCategory(req.params['id'] as string, req.body);
    res.json(category);
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await categoryService.deleteCategory(req.params['id'] as string);
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
};
