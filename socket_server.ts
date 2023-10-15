import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import chatHandler from "./socket/chat_handler.js";

export default (server: http.Server) => {
  const io = new Server(server);

  //auth
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

  //register handlers and assign rooms
  io.on("connection", (socket) => {
    socket.join(socket.data.user);
    socket.join("global");
    socket.on("echo", (args) => socket.emit("echo", args));
    chatHandler(io, socket);
  });

  return io;
};
