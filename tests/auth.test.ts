import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";

beforeAll((done) => {
  done();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authentication Tests", () => {
  const userName = "this is my test post";
  const password = "Asaf";

  test("login", async () => {
    const response = await request(app).post("/auth/login").send({
      username: userName,
      password: password,
    });
    expect(response.statusCode).toEqual(200);
  });

  test("register", async () => {
    const response = await request(app).post("/auth/register").send({
      username: userName,
      password: password,
    });
    expect(response.statusCode).toEqual(200);
  });

  test("logout", async () => {
    const response = await request(app).get("/auth/logout");
    expect(response.statusCode).toEqual(200);
  });
});
