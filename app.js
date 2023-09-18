import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import post_router from "./routers/post_router.js";

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => console.log("connected to mongo"));

const app = express();
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(bodyParser.json());
app.use("/post", post_router);

app.listen(process.env.PORT, () => {
  console.log("Example app listening on port ${port}!");
});
