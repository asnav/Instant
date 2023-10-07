import app from "./server.js";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "Swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV == "development") {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Instant Server REST API",
        version: "1.0.0",
        description:
          'an API specification of the server for the "Instant" app ',
      },
      servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./routers/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}!`);
});
