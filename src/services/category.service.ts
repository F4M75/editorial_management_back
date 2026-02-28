import prisma from '../utils/prisma';

export const getCategories = () => {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
};

export const createCategory = (data: {
  name: string;
  slug: string;
  description: string;
  color: string;
}) => {
  return prisma.category.create({ data });
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
  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) throw new Error('Catégorie non trouvée');
  await prisma.articleCategory.deleteMany({ where: { categoryId: id } });
  return prisma.category.delete({ where: { id } });
};
