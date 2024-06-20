const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Pricing Adjustment API',
        version: '1.0.0',
        description: 'API documentation for Pricing Adjustment',
      },
      servers: [
        {
          url: 'http://localhost:8000', // Your server URL
        },
      ],
    },
    // Path to the API docs
    apis: ['apis/pricingProfile/controller.js', 'apis/pricingAdjustment/controller.js', 'apis/products/controller.js'], // You can add multiple paths here
  };

  const swaggerSpec = swaggerJSDoc(options);
  module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  };