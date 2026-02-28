import prisma from '../utils/prisma';

export const getNotifications = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [total, notifications] = await Promise.all([
    prisma.emailNotification.count(),
    prisma.emailNotification.findMany({
      skip,
      take: limit,
      orderBy: { sentAt: 'desc' },
      include: {
        article: { select: { id: true, title: true } },
      },
    }),
  ]);

  const data = notifications.map((n) => ({
    ...n,
    recipients: JSON.parse(n.recipients) as string[],
  }));

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};
