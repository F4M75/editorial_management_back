import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ─── Networks ────────────────────────────────────────────────────────────────
  const networkPresse = await prisma.network.upsert({
    where: { id: 'network-presse' },
    update: {},
    create: {
      id: 'network-presse',
      name: 'Presse Nationale',
      description: 'Réseau dédié aux articles de presse nationale',
    },
  });

  const networkTech = await prisma.network.upsert({
    where: { id: 'network-tech' },
    update: {},
    create: {
      id: 'network-tech',
      name: 'Tech & Innovation',
      description: 'Réseau spécialisé dans les actualités technologiques',
    },
  });

  const networkCulture = await prisma.network.upsert({
    where: { id: 'network-culture' },
    update: {},
    create: {
      id: 'network-culture',
      name: 'Culture & Société',
      description: 'Réseau couvrant la culture, les arts et la société',
    },
  });

  console.log('✔ Networks created:', networkPresse.name, '|', networkTech.name, '|', networkCulture.name);

  // ─── Categories ───────────────────────────────────────────────────────────────
  const catTech = await prisma.category.upsert({
    where: { slug: 'technologie' },
    update: {},
    create: {
      name: 'Technologie',
      slug: 'technologie',
      description: 'Articles sur les nouvelles technologies et l\'innovation',
      color: '#3B82F6',
    },
  });

  const catPolitique = await prisma.category.upsert({
    where: { slug: 'politique' },
    update: {},
    create: {
      name: 'Politique',
      slug: 'politique',
      description: 'Actualités politiques nationales et internationales',
      color: '#EF4444',
    },
  });

  const catCulture = await prisma.category.upsert({
    where: { slug: 'culture' },
    update: {},
    create: {
      name: 'Culture',
      slug: 'culture',
      description: 'Arts, cinéma, musique et littérature',
      color: '#8B5CF6',
    },
  });

  const catEconomie = await prisma.category.upsert({
    where: { slug: 'economie' },
    update: {},
    create: {
      name: 'Économie',
      slug: 'economie',
      description: 'Finance, marchés et économie mondiale',
      color: '#10B981',
    },
  });

  const catSante = await prisma.category.upsert({
    where: { slug: 'sante' },
    update: {},
    create: {
      name: 'Santé',
      slug: 'sante',
      description: 'Santé publique, médecine et bien-être',
      color: '#F59E0B',
    },
  });

  console.log('✔ Categories created: Technologie | Politique | Culture | Économie | Santé');

  // ─── Users ────────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10);
  const editorPassword = await bcrypt.hash('editor123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@editorial.com' },
    update: {},
    create: {
      email: 'admin@editorial.com',
      password: adminPassword,
      name: 'Admin',
      role: 'admin',
      networkId: networkPresse.id,
    },
  });

  const editor1 = await prisma.user.upsert({
    where: { email: 'editor@editorial.com' },
    update: {},
    create: {
      email: 'editor@editorial.com',
      password: editorPassword,
      name: 'Marie Dupont',
      role: 'editor',
      networkId: networkTech.id,
    },
  });

  const editor2 = await prisma.user.upsert({
    where: { email: 'editor2@editorial.com' },
    update: {},
    create: {
      email: 'editor2@editorial.com',
      password: editorPassword,
      name: 'Jean Martin',
      role: 'editor',
      networkId: networkCulture.id,
    },
  });

  console.log('✔ Users created:', admin.email, '|', editor1.email, '|', editor2.email);

  // ─── Articles ─────────────────────────────────────────────────────────────────
  const articles = [
    {
      id: 'article-1',
      title: 'L\'intelligence artificielle révolutionne l\'industrie',
      content: 'L\'intelligence artificielle (IA) transforme profondément les secteurs industriels à travers le monde. Des usines automatisées aux algorithmes de recommandation, les applications sont innombrables. Les experts s\'accordent à dire que cette révolution ne fait que commencer, avec des impacts majeurs sur l\'emploi, la productivité et la créativité humaine.',
      excerpt: 'L\'IA transforme profondément les secteurs industriels à travers le monde.',
      author: editor1.name,
      networkId: networkTech.id,
      status: 'published' as const,
      featured: true,
      publishedAt: new Date('2024-11-15'),
      categories: [catTech.id],
    },
    {
      id: 'article-2',
      title: 'Réforme fiscale : ce qui change en 2025',
      content: 'Le gouvernement a annoncé une série de mesures fiscales qui entreront en vigueur dès le début de l\'année 2025. Parmi les principales modifications, on note une révision des tranches d\'imposition sur le revenu, de nouvelles exonérations pour les petites entreprises et un renforcement de la taxation des plus-values immobilières.',
      excerpt: 'Le gouvernement annonce des changements fiscaux majeurs pour 2025.',
      author: admin.name,
      networkId: networkPresse.id,
      status: 'published' as const,
      featured: false,
      publishedAt: new Date('2024-12-01'),
      categories: [catPolitique.id, catEconomie.id],
    },
    {
      id: 'article-3',
      title: 'Festival de Cannes 2025 : les films à ne pas manquer',
      content: 'La 78e édition du Festival de Cannes s\'annonce exceptionnelle avec une sélection de films internationaux de haute tenue. Entre auteurs confirmés et nouvelles voix du cinéma mondial, le programme promet des découvertes marquantes. Retour sur les œuvres les plus attendues de cette édition.',
      excerpt: 'La sélection officielle de Cannes 2025 dévoile ses pépites cinématographiques.',
      author: editor2.name,
      networkId: networkCulture.id,
      status: 'published' as const,
      featured: true,
      publishedAt: new Date('2025-01-10'),
      categories: [catCulture.id],
    },
    {
      id: 'article-4',
      title: 'Les nouvelles thérapies contre le cancer : espoir ou miroir ?',
      content: 'Les immunothérapies et les thérapies ciblées représentent une avancée considérable dans la lutte contre le cancer. Plusieurs essais cliniques récents montrent des taux de rémission sans précédent pour certains types de tumeurs. Cependant, leur coût élevé et leur accessibilité limitée soulèvent des questions éthiques importantes.',
      excerpt: 'Les nouvelles thérapies anticancéreuses offrent des résultats prometteurs mais posent des questions d\'accès.',
      author: admin.name,
      networkId: networkPresse.id,
      status: 'published' as const,
      featured: false,
      publishedAt: new Date('2025-01-20'),
      categories: [catSante.id],
    },
    {
      id: 'article-5',
      title: 'Cryptomonnaies : bilan et perspectives pour 2025',
      content: 'Après une année 2024 marquée par une forte volatilité, le marché des cryptomonnaies aborde 2025 avec de nouvelles ambitions. L\'adoption institutionnelle progresse, les régulations se précisent et de nouveaux cas d\'usage émergent. Analyse des tendances qui vont façonner l\'avenir de la finance décentralisée.',
      excerpt: 'Le marché crypto se stabilise et se structure à l\'approche de 2025.',
      author: editor1.name,
      networkId: networkTech.id,
      status: 'draft' as const,
      featured: false,
      publishedAt: null,
      categories: [catEconomie.id, catTech.id],
    },
    {
      id: 'article-6',
      title: 'La renaissance du livre papier face au numérique',
      content: 'Contre toute attente, les ventes de livres papier ont augmenté ces deux dernières années. Les lecteurs semblent rechercher une expérience tangible et déconnectée face à la surexposition aux écrans. Les librairies indépendantes connaissent un regain d\'intérêt notable, notamment auprès des jeunes générations.',
      excerpt: 'Les livres papier résistent et séduisent même les nouvelles générations.',
      author: editor2.name,
      networkId: networkCulture.id,
      status: 'archived' as const,
      featured: false,
      publishedAt: new Date('2024-09-05'),
      categories: [catCulture.id],
    },
  ];

  for (const article of articles) {
    const { categories, ...rest } = article;
    await prisma.article.upsert({
      where: { id: rest.id },
      update: {},
      create: {
        ...rest,
        categories: {
          create: categories.map((categoryId) => ({ categoryId })),
        },
      },
    });
  }

  console.log(`✔ Articles created: ${articles.length} articles`);

  // ─── Email Notifications ──────────────────────────────────────────────────────
  const notifications = [
    {
      id: 'notif-1',
      articleId: 'article-1',
      recipients: JSON.stringify(['redaction@editorial.com', 'chef.desk@editorial.com']),
      subject: 'Nouvel article publié : L\'intelligence artificielle révolutionne l\'industrie',
      sentAt: new Date('2024-11-15T10:30:00'),
      status: 'sent' as const,
    },
    {
      id: 'notif-2',
      articleId: 'article-3',
      recipients: JSON.stringify(['abonnes@editorial.com', 'partenaires@editorial.com', 'presse@editorial.com']),
      subject: 'À la une — Festival de Cannes 2025 : les films à ne pas manquer',
      sentAt: new Date('2025-01-10T09:00:00'),
      status: 'sent' as const,
    },
    {
      id: 'notif-3',
      articleId: 'article-4',
      recipients: JSON.stringify(['newsletter@editorial.com']),
      subject: 'Article santé : Les nouvelles thérapies contre le cancer',
      sentAt: new Date('2025-01-20T14:15:00'),
      status: 'failed' as const,
    },
  ];

  for (const notif of notifications) {
    await prisma.emailNotification.upsert({
      where: { id: notif.id },
      update: {},
      create: notif,
    });
  }

  console.log(`✔ Notifications created: ${notifications.length} notifications`);
  console.log('');
  console.log('─────────────────────────────────────────');
  console.log('Credentials:');
  console.log('  Admin  → admin@editorial.com   / admin123');
  console.log('  Editor → editor@editorial.com  / editor123');
  console.log('  Editor → editor2@editorial.com / editor123');
  console.log('─────────────────────────────────────────');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
