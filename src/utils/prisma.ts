import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

export default prisma;
