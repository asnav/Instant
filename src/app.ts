import app from "./server.js";
import dotenv from "dotenv";
dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}!`);
});
