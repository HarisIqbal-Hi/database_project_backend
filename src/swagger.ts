import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Chemnitz Cultural Sites API",
            version: "1.0.0",
            description: "API for cultural sites project in Chemnitz",
        },
        servers: [{ url: "http://localhost:3000/api" }],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "access_token"
                }
            }
        },
        security: [{ cookieAuth: [] }]
    },
    apis: [path.join(__dirname, "routes/*.ts")],
};
console.log("Generating swagger spec...");
const swaggerSpec = swaggerJSDoc(options);
console.log("Swagger spec generated!", JSON.stringify(swaggerSpec, null, 2));
export default swaggerSpec;