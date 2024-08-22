const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
   swaggerDefinition: {
      openapi: '3.0.0',
      info: {
         title: 'STOCK API',
         version: '1.0.0',
         description: 'STOCK API',
      },
      servers: [
         {
            url: 'http://localhost:10010',
            description: 'local server',
         },
      ],
   },
   apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec, swaggerUi };
