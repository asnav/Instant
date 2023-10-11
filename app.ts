import server from "./server.js";
import io from "./socket_server.js";
import dotenv from "dotenv";
dotenv.config();

io(server);
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}!`);
});

export default server;