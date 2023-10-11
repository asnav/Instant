import server from "../app.js";
import mongoose from "mongoose";
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import request from "supertest";
import User from "../models/user_model.js";
import Post from "../models/post_model.js";

let clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>;
const user = {
  username: "user",
  email: "user@email.com",
  password: "Password123",
};
let token: string;

beforeAll(async () => {
  await User.deleteMany();
  await Post.deleteMany();
  await request(server).post("/auth/register").send(user);
  token = (
    await request(server).post("/auth/login").send({
      identifier: user.username,
      password: user.password,
    })
  ).body.access_token;
  clientSocket = Client(`http://localhost:${process.env.PORT}`, {
    auth: { token: `jwt ${token}` },
  });
  new Promise((resolve) => clientSocket.on("connect", () => resolve(true)));
});

afterAll(() => {
  server.close();
  clientSocket.close();
  mongoose.connection.close();
});

describe("my awesome project", () => {
  test("should work", (done) => {
    clientSocket.emit("hello", { msg: "hello" });
    clientSocket.onAny((eventName, arg) => {
      console.log("on any");
      expect(eventName).toBe("echo");
      expect(arg.msg).toBe("hello");
      done();
    });
  });
});
