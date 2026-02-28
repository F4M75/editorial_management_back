import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Editorial Management API',
      version: '1.0.0',
      description: 'API de gestion éditoriale — articles, catégories, réseaux et notifications email',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'editor'] },
            networkId: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Network: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            color: { type: 'string', example: '#FF5733' },
          },
        },
        Article: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            excerpt: { type: 'string' },
            author: { type: 'string' },
            networkId: { type: 'string' },
            network: { $ref: '#/components/schemas/Network' },
            categories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { $ref: '#/components/schemas/Category' },
                },
              },
            },
            status: { type: 'string', enum: ['draft', 'published', 'archived'] },
            featured: { type: 'boolean' },
            publishedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ArticleInput: {
          type: 'object',
          required: ['title', 'content', 'excerpt', 'author', 'networkId'],
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            excerpt: { type: 'string' },
            author: { type: 'string' },
            networkId: { type: 'string' },
            categories: {
              type: 'array',
              items: { type: 'string' },
              description: 'Liste des IDs de catégories',
            },
            status: { type: 'string', enum: ['draft', 'published', 'archived'], default: 'draft' },
            featured: { type: 'boolean', default: false },
          },
        },
        EmailNotification: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            articleId: { type: 'string' },
            recipients: { type: 'string', description: 'JSON array of emails' },
            subject: { type: 'string' },
            sentAt: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['sent', 'failed'] },
          },
        },
        PaginatedArticles: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { $ref: '#/components/schemas/Article' } },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                page: { type: 'integer' },
                limit: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Token manquant ou invalide',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
