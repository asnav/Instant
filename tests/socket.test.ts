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

beforeAll((done) => {
  User.deleteMany().then(() =>
    Post.deleteMany().then(() =>
      request(server)
        .post("/auth/register")
        .send(user)
        .then(() =>
          request(server)
            .post("/auth/login")
            .send({
              identifier: user.username,
              password: user.password,
            })
            .then((user) => {
              clientSocket = Client(`http://localhost:${process.env.PORT}`, {
                auth: { token: `jwt ${user.body.access_token}` },
              });
              clientSocket.on("connect", done);
            })
        )
    )
  );
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
