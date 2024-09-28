// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const options = {
//    swaggerDefinition: {
//       openapi: '3.0.0',
//       info: {
//          title: 'STOCK API',
//          version: '1.0.0',
//          description: 'STOCK API',
//       },
//       servers: [
//          {
//             url: 'http://15.165.75.251:10010/',
//             description: 'tadak server',
//          },
//       ],
//    },
//    apis: ['./src/routes/*.ts'],
// };

// const swaggerSpec = swaggerJSDoc(options);

// module.exports = { swaggerSpec, swaggerUi };

const swaggerAutogen = require('swagger-autogen')();

const options = {
   swaggerDefinition: {
      openapi: '3.0.0',
      info: {
         title: 'TADAK API',
         version: '1.0.0',
         description: 'TADAK API',
      },
      servers: [
         {
            url: 'http://15.165.75.251:10010/',
            description: 'TADAK SERVER',
         },
      ],
   },
   apis: [],
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['../server.ts'];

swaggerAutogen(outputFile, endpointsFiles, options);
