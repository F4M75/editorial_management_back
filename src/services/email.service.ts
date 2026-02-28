import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_HOST) {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const loadTemplate = (templateName: string): string => {
  const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
  return fs.readFileSync(templatePath, 'utf-8');
};

const renderTemplate = (template: string, variables: Record<string, string>): string => {
  return Object.entries(variables).reduce(
    (html, [key, value]) => html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value),
    template
  );
};

export interface ArticleEmailData {
  title: string;
  author: string;
  excerpt: string;
  publishedAt: string;
  networkName: string;
  articleUrl: string;
  categories: Array<{ name: string; color: string }>;
}

export const sendArticleNotification = async (options: {
  recipients: string[];
  subject: string;
  article: ArticleEmailData;
}): Promise<void> => {
  const { recipients, subject, article } = options;

  const categoryTags = article.categories
    .map(
      (cat) =>
        `<span class="category-tag" style="background-color:${cat.color}">${cat.name}</span>`
    )
    .join('');

  const template = loadTemplate('article-notification');
  const html = renderTemplate(template, {
    subject,
    title: article.title,
    author: article.author,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    networkName: article.networkName,
    articleUrl: article.articleUrl,
    categories: categoryTags,
    categoryColor: article.categories[0]?.color ?? '#1a56db',
  });

  const transporter = createTransporter();

  if (!process.env.SMTP_HOST) {
    console.log('[Email mock]', { to: recipients, subject });
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: recipients.join(', '),
    subject,
    html,
  });
};
