import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Financial app API",
      version: "1.0.0",
      description: "API d'authentification",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Serveur de développement",
      },
      {
        url: "https://financial-app-flds.onrender.com",
        description: "Serveur de production",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Cherche les annotations Swagger dans les routes
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
