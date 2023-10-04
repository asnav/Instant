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
  const userName = "username";
  const email = "email@test.com";
  const password = "Password123";
  let token: string;

  test("register", async () => {
    const response = await request(app).post("/auth/register").send({
      username: userName,
      email: email,
      password: password,
    });
    expect(response.statusCode).toEqual(200);
  });

  test("register with taken username", async () => {
    const response = await request(app).post("/auth/register").send({
      username: userName,
      email: email,
      password: password,
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("username already taken");
  });

  test("register with used email", async () => {
    const response = await request(app).post("/auth/register").send({
      username: "other",
      email: email,
      password: password,
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("email already used");
  });

  test("login with username and password", async () => {
    const response = await request(app).post("/auth/login").send({
      identifier: userName,
      password: password,
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body.access_token).not.toBeUndefined();
    token = response.body.access_token;
  });

  test("login with email and password", async () => {
    const response = await request(app).post("/auth/login").send({
      identifier: email,
      password: password,
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body.access_token).not.toBeUndefined();
  });

  test("login with unregistered identifier", async () => {
    const response = await request(app).post("/auth/login").send({
      identifier: "unregistered",
      password: password,
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("incorrect identifier or password");
  });

  test("login with correct email and wrong password", async () => {
    const response = await request(app).post("/auth/login").send({
      identifier: email,
      password: "wrongPassword",
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("incorrect identifier or password");
  });

  test("login with correct username and wrong password", async () => {
    const response = await request(app).post("/auth/login").send({
      identifier: userName,
      password: "wrongPassword",
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("incorrect identifier or password");
  });

  test("logout with false token", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "jwt " + token + "1");
    expect(response.statusCode).toEqual(403);
  });

  test("logout with correct token", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "jwt " + token);
    expect(response.body.message).toEqual("not implemented");
  });
});
