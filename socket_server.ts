import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export default (server: http.Server) => {
  const io = new Server(server);

  io.use(async (socket, next) => {
    let token = socket.handshake.auth.token;
    if (token == null) return next(new Error("Authentication error"));
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) return next(new Error("authentication error"));
      socket.data.user = user["_id"];
      return next();
    });
  });

  io.on("connection", (socket) => {
    console.log("a user connected" + socket.id);
    socket.onAny((eventName, args) => {
      console.log("on event: " + eventName);
      socket.emit("echo", args);
    });
  });
  return io;
};
