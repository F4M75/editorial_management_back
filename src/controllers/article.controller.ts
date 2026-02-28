import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as articleService from '../services/article.service';

const handleError = (res: Response, err: unknown, status = 500) => {
  const message = err instanceof Error ? err.message : 'Erreur serveur';
  const code = message === 'Article non trouvé' ? 404 : status;
  res.status(code).json({ message });
};

export const getArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, featured, networkId, categoryId, author, search, page, limit } = req.query;
    const result = await articleService.getArticles({
      status: status as 'draft' | 'published' | 'archived' | undefined,
      featured: featured !== undefined ? featured === 'true' : undefined,
      networkId: networkId as string | undefined,
      categoryId: categoryId as string | undefined,
      author: author as string | undefined,
      search: search as string | undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
};

export const getArticleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await articleService.getArticleById(req.params['id'] as string);
    res.json(article);
  } catch (err) {
    handleError(res, err);
  }
};

export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await articleService.createArticle(req.body);
    res.status(201).json(article);
  } catch (err) {
    handleError(res, err, 400);
  }
};

export const updateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const article = await articleService.updateArticle(req.params['id'] as string, req.body);
    res.json(article);
  } catch (err) {
    handleError(res, err, 400);
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await articleService.deleteArticle(req.params['id'] as string);
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
};

export const changeStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body as { status: 'draft' | 'published' | 'archived' };
    const article = await articleService.changeStatus(req.params['id'] as string, status);
    res.json(article);
  } catch (err) {
    handleError(res, err, 400);
  }
};

export const notifyArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { recipients, subject } = req.body as { recipients: string[]; subject: string };
    const notification = await articleService.notifyArticle(
      req.params['id'] as string,
      recipients,
      subject
    );
    res.status(201).json(notification);
  } catch (err) {
    handleError(res, err, 400);
  }
};
