import prisma from '../utils/prisma';

export const getCategories = () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  });
};

export const createCategory = (data: {
  name: string;
  slug: string;
  description?: string;
  color: string;
}) => {
  return prisma.category.create({
    data: { ...data, description: data.description ?? null },
  });
};

export const updateCategory = async (
  id: string,
  data: { name?: string; slug?: string; description?: string; color?: string }
) => {
  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) throw new Error('Catégorie non trouvée');
  return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { articles: true } } },
  });
  if (!category) throw new Error('Catégorie non trouvée');
  if (category._count.articles > 0) {
    throw new Error(`Impossible de supprimer : ${category._count.articles} article(s) utilisent cette catégorie`);
  }
  return prisma.category.delete({ where: { id } });
};
