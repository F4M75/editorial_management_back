import prisma from '../utils/prisma';

export const getNetworks = () => {
  return prisma.network.findMany({ orderBy: { name: 'asc' } });
};
