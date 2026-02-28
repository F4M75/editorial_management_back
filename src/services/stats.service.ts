import prisma from '../utils/prisma';

export const getStats = async () => {
  const [total, draft, published, archived, networks, categories, recentArticles, recentNotifications] =
    await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'draft' } }),
      prisma.article.count({ where: { status: 'published' } }),
      prisma.article.count({ where: { status: 'archived' } }),
      prisma.network.findMany(),
      prisma.category.findMany(),
      prisma.article.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        include: { network: true, categories: { include: { category: true } } },
      }),
      prisma.emailNotification.findMany({
        orderBy: { sentAt: 'desc' },
        take: 5,
        include: { article: { select: { id: true, title: true } } },
      }),
    ]);

  const byNetwork = await Promise.all(
    networks.map(async (n) => ({
      id: n.id,
      name: n.name,
      count: await prisma.article.count({ where: { networkId: n.id } }),
    }))
  );

  const byCategory = await Promise.all(
    categories.map(async (c) => ({
      id: c.id,
      name: c.name,
      color: c.color,
      count: await prisma.articleCategory.count({ where: { categoryId: c.id } }),
    }))
  );

  return {
    articles: { total, draft, published, archived },
    byNetwork,
    byCategory,
    recentArticles,
    recentNotifications: recentNotifications.map((n) => ({
      ...n,
      recipients: JSON.parse(n.recipients) as string[],
    })),
  };
};
