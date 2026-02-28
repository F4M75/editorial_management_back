import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@editorial.com' },
    update: {},
    create: {
      email: 'admin@editorial.com',
      password,
      name: 'Admin',
      role: 'admin',
    },
  });

  console.log('✔ User created:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
