import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CV Generator API',
      version,
      description: 'API para generación de CVs en PDF'
    },
    servers: [
      { url: 'http://localhost:3000/api' }
    ],
    components: {
      schemas: {
        GenerateCVInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            phone: { type: 'string', example: '+123456789', nullable: true },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Software Engineer' },
                  company: { type: 'string', example: 'Tech Inc' },
                  period: { type: 'string', example: '2020-2023' }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };