import { Server, Socket } from "socket.io";

export default (io: Server, socket: Socket) => {
  socket.on("ims:sendDirect", async (directMessage) => {
    directMessage.to = socket.data.user;
    console.log("sendDM to " + directMessage.to);
    directMessage.from = socket.data.user;
    io.to(directMessage.to).emit("ims:sendDirect", directMessage);
  });
};
