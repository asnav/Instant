import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";
import User from "../models/user_model.js";

beforeAll(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await User.deleteMany();
  await mongoose.connection.close();
});

describe("Authentication Tests", () => {
  const user = {
    username: "username",
    email: "email@test.com",
    password: "Password123",
  };
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  test("request posting with no token", async () => {
    const response = await request(app).post("/post").send({
      message: "this is my test post",
      sender: user.username,
    });
    expect(response.statusCode).toEqual(401);
  });

  test("register", async () => {
    const response = await request(app).post("/auth/register").send({
      username: user.username,
      email: user.email,
      password: user.password,
    });
    expect(response.statusCode).toEqual(200);
  });

  test("register with taken username", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("username already taken");
  });

  test("register with used email", async () => {
    const response = await request(app).post("/auth/register").send({
      username: "other",
      email: user.email,
      password: user.password,
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("email already used");
  });

  test("login with username and password", async () => {
    const response = await request(app).post("/auth/login").send({
      identifier: user.username,
      password: user.password,
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body.accessToken).not.toBeUndefined();
    expect(response.body.refreshToken).not.toBeUndefined();
    expect(response.body.accessToken).not.toEqual(response.body.refreshToken);
    expect(response.body.userId).not.toBeUndefined();
  });

  test("login with email and password", async () => {
    const response = await request(app).post("/auth/login").send({
      identifier: user.email,
      password: user.password,
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body.accessToken).not.toBeUndefined();
    expect(response.body.refreshToken).not.toBeUndefined();
    expect(response.body.accessToken).not.toEqual(response.body.refreshToken);
    expect(response.body.userId).not.toBeUndefined();
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    userId = response.body.userId;
  });

  test("login with unregistered identifier", async () => {
    const response = await request(app).post("/auth/login").send({
      identifier: "unregistered",
      password: user.password,
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("incorrect identifier or password");
  });

  test("login with correct email and wrong password", async () => {
    const response = await request(app).post("/auth/login").send({
      identifier: user.email,
      password: "wrongPassword",
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("incorrect identifier or password");
  });

  test("login with correct username and wrong password", async () => {
    const response = await request(app).post("/auth/login").send({
      identifier: user.username,
      password: "wrongPassword",
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("incorrect identifier or password");
  });

  test("request posting with valid token", async () => {
    const response = await request(app)
      .post("/post")
      .set("Authorization", "jwt " + accessToken)
      .send({ message: "this is my test post" });
    expect(response.statusCode).toEqual(200);
  });

  test("request posting with invalid token", async () => {
    const response = await request(app)
      .post("/post")
      .set("Authorization", "jwt " + refreshToken)
      .send({
        message: "this is my test post",
        sender: user.username,
      });
    expect(response.statusCode).toEqual(403);
  });

  // jest.setTimeout(10000);

  // test("request posting with expired token", async () => {
  //   await new Promise((r) => setTimeout(r, 3000));
  //   const response = await request(app)
  //     .post("/post")
  //     .set("Authorization", "jwt " + accessToken)
  //     .send({
  //       message: "this is my test post",
  //       sender: user.username,
  //     });
  //   expect(response.body.message).toEqual("jwt expired");
  // });

  test("refresh token with valid unused token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "jwt " + refreshToken);
    expect(response.statusCode).toEqual(200);
    expect(response.body.accessToken).not.toEqual(accessToken);
    expect(response.body.refreshToken).not.toEqual(refreshToken);
    expect(response.body.userId).toEqual(userId);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  });

  test("logout with false token", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "jwt " + accessToken);
    expect(response.statusCode).toEqual(403);
  });

  test("logout with correct token", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "jwt " + refreshToken);
    expect(response.statusCode).toEqual(200);
  });
});
