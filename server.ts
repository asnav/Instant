import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import post_router from "./routers/post_router.js";
import auth_router from "./routers/auth_router.js";
import file_router from "./routers/file_router.js";

import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import http from "http";

dotenv.config();

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => console.log("connected to mongo"));

const app = express();
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/post", post_router);
app.use("/auth", auth_router);
app.use("/file", file_router);

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

const server = http.createServer(app);
export default server;
