import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Pizzaria Massa Nostra',
    version: '1.0.0',
    description: 'Documentação da API da pizzaria digital com autenticação, pedidos, clientes e auditoria.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }]
}

const options = {
  swaggerDefinition,
  apis: ['src/routes/*.ts', 'src/swagger/*.ts']
}

const swaggerSpec = swaggerJSDoc(options)

export function setupSwagger(app: Express) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
