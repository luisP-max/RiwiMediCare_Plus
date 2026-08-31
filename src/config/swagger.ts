import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'RiwiMediCare Plus - Supply Chain REST API',
            version: '1.0.0',
            description: 'Official enterprise interactive API contract documentation for healthcare replenishment logistics tracking management.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local Container Development Environment Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Inject your cryptographic JSON Web Token obtained from the logIn endpoint to unlock restricted administrative routes operations.',
                },
            },
        },
    },
    // Tells the framework reader to process annotations directly inside compiling routes maps
    apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
