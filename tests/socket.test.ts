import server from "../app.js";
import mongoose from "mongoose";
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import request from "supertest";

let clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>;
const user = {
  identifier: "test",
  password: "Password123",
};
let tokens: { accessToken: string; refreshToken: string; userId: string };

beforeAll(async () => {
  tokens = (await request(server).post("/auth/login").send(user)).body;
  clientSocket = Client(`http://localhost:${process.env.PORT}`, {
    auth: { token: `jwt ${tokens.accessToken}` },
  });
  new Promise((resolve) => clientSocket.on("connect", () => resolve(true)));
});

afterAll(async () => {
  await request(server)
    .get("/auth/logout")
    .set("Authorization", "jwt " + tokens.refreshToken)
    .send();
  server.close();
  clientSocket.close();
  mongoose.connection.close();
});

describe("Socket functionality tests", () => {
  test("echo test", (done) => {
    clientSocket.emit("echo", { msg: "hello" });
    clientSocket.on("echo", (arg) => {
      expect(arg.msg).toBe("hello");
      done();
    });
  });
  test("self DM test", (done) => {
    clientSocket.emit("ims:sendDirect", { message: "hello" });
    clientSocket.on("ims:sendDirect", (arg) => {
      expect(arg.message).toBe("hello");
      expect(arg.to).toEqual(arg.from);
      done();
    });
  });
});
