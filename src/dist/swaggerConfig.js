"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerUi = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const options = {
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpec = swaggerSpec;
