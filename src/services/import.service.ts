import prisma from '../utils/prisma';

interface ArticleImportRow {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  networkId: string;
  categories?: string[];
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  publishedAt?: string | null;
}

export const importArticles = async (rows: unknown[]) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Le fichier JSON doit contenir un tableau non vide');
  }

  const results = { success: 0, failed: 0, errors: [] as string[] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] as ArticleImportRow;

    try {
      if (!row.title || !row.content || !row.excerpt || !row.author || !row.networkId) {
        throw new Error('Champs requis manquants: title, content, excerpt, author, networkId');
      }

      const { categories = [], ...rest } = row;

      await prisma.article.create({
        data: {
          title: rest.title,
          content: rest.content,
          excerpt: rest.excerpt,
          author: rest.author,
          networkId: rest.networkId,
          status: rest.status ?? 'draft',
          featured: rest.featured ?? false,
          publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : null,
          categories: {
            create: categories.map((categoryId) => ({ categoryId })),
          },
        },
      });

      results.success++;
    } catch (err) {
      results.failed++;
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      results.errors.push(`Ligne ${i + 1}: ${message}`);
    }
  }

  return results;
};
