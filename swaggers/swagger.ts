const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
   swaggerDefinition: {
      openapi: '3.0.0',
      info: {
         title: 'STOCK API TEST',
         version: '1.0.0',
         description: 'STOCK API TEST',
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

module.exports = { swaggerUi, swaggerSpec };
