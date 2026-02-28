import prisma from '../utils/prisma';
import { sendArticleNotification } from './email.service';

export interface ArticleFilters {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  networkId?: string;
  categoryId?: string;
  author?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const articleInclude = {
  categories: { include: { category: true } },
  network: true,
};

export const getArticles = async (filters: ArticleFilters) => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters.status) where['status'] = filters.status;
  if (filters.featured !== undefined) where['featured'] = filters.featured;
  if (filters.networkId) where['networkId'] = filters.networkId;
  if (filters.author) where['author'] = { contains: filters.author };
  if (filters.categoryId) {
    where['categories'] = { some: { categoryId: filters.categoryId } };
  }
  if (filters.search) {
    where['OR'] = [
      { title: { contains: filters.search } },
      { excerpt: { contains: filters.search } },
      { content: { contains: filters.search } },
    ];
  }

  const [total, articles] = await Promise.all([
    prisma.article.count({ where: where as never }),
    prisma.article.findMany({
      where: where as never,
      include: articleInclude,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    data: articles,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const getArticleById = async (id: string) => {
  const article = await prisma.article.findUnique({
    where: { id },
    include: articleInclude,
  });
  if (!article) throw new Error('Article non trouvé');
  return article;
};

export const createArticle = async (data: {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  networkId: string;
  categories?: string[];
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
}) => {
  const { categories = [], ...rest } = data;
  return prisma.article.create({
    data: {
      ...rest,
      publishedAt: rest.status === 'published' ? new Date() : null,
      categories: {
        create: categories.map((categoryId) => ({ categoryId })),
      },
    },
    include: articleInclude,
  });
};

export const updateArticle = async (
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    author?: string;
    networkId?: string;
    categories?: string[];
    status?: 'draft' | 'published' | 'archived';
    featured?: boolean;
  }
) => {
  await getArticleById(id);
  const { categories, ...rest } = data;

  return prisma.article.update({
    where: { id },
    data: {
      ...rest,
      ...(categories !== undefined && {
        categories: {
          deleteMany: {},
          create: categories.map((categoryId) => ({ categoryId })),
        },
      }),
    },
    include: articleInclude,
  });
};

export const deleteArticle = async (id: string) => {
  await getArticleById(id);
  await prisma.articleCategory.deleteMany({ where: { articleId: id } });
  await prisma.emailNotification.deleteMany({ where: { articleId: id } });
  return prisma.article.delete({ where: { id } });
};

export const changeStatus = async (id: string, status: 'draft' | 'published' | 'archived') => {
  await getArticleById(id);
  return prisma.article.update({
    where: { id },
    data: {
      status,
      publishedAt: status === 'published' ? new Date() : undefined,
    },
    include: articleInclude,
  });
};

export const notifyArticle = async (
  id: string,
  recipients: string[],
  subject: string
) => {
  const article = await getArticleById(id);

  await sendArticleNotification({
    recipients,
    subject,
    article: {
      title: article.title,
      author: article.author,
      excerpt: article.excerpt,
      publishedAt: article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
      networkName: article.network.name,
      articleUrl: `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/articles/${article.id}`,
      categories: article.categories.map((ac) => ({
        name: ac.category.name,
        color: ac.category.color,
      })),
    },
  });

  return prisma.emailNotification.create({
    data: {
      articleId: id,
      recipients: JSON.stringify(recipients),
      subject,
      sentAt: new Date(),
      status: 'sent',
    },
  });
};
