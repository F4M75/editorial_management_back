import prisma from '../utils/prisma';

interface ArticleImportRow {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  networkId?: string;
  network?: string;
  categories?: string[];
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  publishedAt?: string | null;
}

export const importArticles = async (rows: ArticleImportRow[]) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Le fichier JSON doit contenir un tableau non vide');
  }

  // Pre-load lookup tables once
  const [allNetworks, allCategories] = await Promise.all([
    prisma.network.findMany({ select: { id: true, name: true } }),
    prisma.category.findMany({ select: { id: true, name: true, slug: true } }),
  ]);

  const networkByName = new Map(allNetworks.map((n) => [n.name.toLowerCase(), n.id]));
  const categoryBySlug = new Map(allCategories.map((c) => [c.slug.toLowerCase(), c.id]));
  const categoryByName = new Map(allCategories.map((c) => [c.name.toLowerCase(), c.id]));

  const resolveNetwork = (row: ArticleImportRow): string => {
    if (row.networkId) return row.networkId;
    const id = networkByName.get((row.network ?? '').toLowerCase());
    if (!id) throw new Error(`Réseau introuvable : "${row.network}"`);
    return id;
  };

  const resolveCategories = (row: ArticleImportRow): string[] => {
    // categories[] takes precedence (already IDs or slugs)
    const list = row.category
      ? [row.category]
      : (row.categories ?? []);

    return list.map((ref) => {
      const bySlug = categoryBySlug.get(ref.toLowerCase());
      if (bySlug) return bySlug;
      const byName = categoryByName.get(ref.toLowerCase());
      if (byName) return byName;
      // Treat as raw ID fallback
      return ref;
    });
  };

  const results = { success: 0, failed: 0, errors: [] as string[] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      const networkId = resolveNetwork(row);
      const categoryIds = resolveCategories(row);

      await prisma.article.create({
        data: {
          title:       row.title,
          content:     row.content,
          excerpt:     row.excerpt,
          author:      row.author,
          networkId,
          status:      row.status ?? 'draft',
          featured:    row.featured ?? false,
          publishedAt: row.publishedAt ? new Date(row.publishedAt) : null,
          categories: {
            create: categoryIds.map((categoryId) => ({ categoryId })),
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
