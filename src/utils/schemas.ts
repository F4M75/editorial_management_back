import { z } from 'zod';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

// ─── Article ─────────────────────────────────────────────────────────────────

const articleStatusEnum = z.enum(['draft', 'published', 'archived']);

export const createArticleSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(255),
  content: z.string().min(1, 'Contenu requis'),
  excerpt: z.string().min(1, 'Extrait requis').max(500),
  author: z.string().min(1, 'Auteur requis'),
  networkId: z.string().min(1, 'Réseau requis'),
  categories: z.array(z.string()).optional().default([]),
  status: articleStatusEnum.optional().default('draft'),
  featured: z.boolean().optional().default(false),
});

export const updateArticleSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().min(1).max(500).optional(),
  author: z.string().min(1).optional(),
  networkId: z.string().min(1).optional(),
  categories: z.array(z.string()).optional(),
  status: articleStatusEnum.optional(),
  featured: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Au moins un champ est requis pour la mise à jour',
});

export const changeStatusSchema = z.object({
  status: articleStatusEnum,
});

export const notifyArticleSchema = z.object({
  recipients: z
    .array(z.string().email('Email destinataire invalide'))
    .min(1, 'Au moins un destinataire requis'),
  subject: z.string().min(1, 'Sujet requis').max(255),
});

export const articleListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  status: articleStatusEnum.optional(),
  featured: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  networkId: z.string().optional(),
  categoryId: z.string().optional(),
  author: z.string().optional(),
  search: z.string().optional(),
});

// ─── Category ─────────────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
  slug: z
    .string()
    .min(1, 'Slug requis')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide (ex: mon-slug)'),
  description: z.string().min(1, 'Description requise'),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Couleur hex invalide (ex: #FF5733)'),
});

export const updateCategorySchema = createCategorySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Au moins un champ est requis pour la mise à jour' }
);

// ─── Import ───────────────────────────────────────────────────────────────────

export const importArticleRowSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  content: z.string().min(1, 'Contenu requis'),
  excerpt: z.string().min(1, 'Extrait requis'),
  author: z.string().min(1, 'Auteur requis'),
  networkId: z.string().min(1, 'Réseau requis'),
  categories: z.array(z.string()).optional().default([]),
  status: articleStatusEnum.optional().default('draft'),
  featured: z.boolean().optional().default(false),
  publishedAt: z.string().datetime().nullable().optional(),
});

export const importArticlesSchema = z
  .array(importArticleRowSchema)
  .min(1, 'Le tableau ne peut pas être vide');

// ─── Pagination ───────────────────────────────────────────────────────────────

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
