export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Support Ticket System API',
    version: '0.1.0',
    description: 'JWT-protected CRUD API for support tickets.',
  },
  servers: [{ url: '/' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/token': {
      post: {
        summary: 'Create a short-lived demo token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { role: { type: 'string', enum: ['User', 'Agent', 'Admin'] } },
                required: ['role'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Token created' },
          400: { description: 'Invalid role' },
        },
      },
    },
    '/tickets': {
      get: {
        security: [{ bearerAuth: [] }],
        summary: 'List tickets with filtering and pagination',
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'offset', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'priority', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['updatedAt', 'createdAt', 'priority', 'status', 'votes'] } },
          { name: 'direction', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: { 200: { description: 'Ticket list' }, 401: { description: 'Missing token' } },
      },
      post: {
        security: [{ bearerAuth: [] }],
        summary: 'Create ticket',
        responses: { 201: { description: 'Ticket created' }, 403: { description: 'Forbidden' } },
      },
    },
    '/tickets/{id}': {
      get: {
        security: [{ bearerAuth: [] }],
        summary: 'Get ticket by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Ticket' }, 404: { description: 'Not found' } },
      },
      patch: {
        security: [{ bearerAuth: [] }],
        summary: 'Update ticket',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Ticket updated' }, 403: { description: 'Forbidden' } },
      },
      delete: {
        security: [{ bearerAuth: [] }],
        summary: 'Delete ticket',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Ticket deleted' }, 403: { description: 'Forbidden' } },
      },
    },
    '/tickets/{id}/vote': {
      post: {
        security: [{ bearerAuth: [] }],
        summary: 'Upvote ticket',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Ticket upvoted' }, 403: { description: 'Forbidden' } },
      },
    },
  },
};
