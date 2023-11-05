import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";

const user = {
  username: "user",
  email: "user@email.com",
  password: "Password123",
};
let token: string;

beforeAll(async () => {
  await request(app).post("/auth/register").send(user);
  token = (
    await request(app).post("/auth/login").send({
      identifier: user.username,
      password: user.password,
    })
  ).body.access_token;
});
afterAll(async () => await mongoose.connection.close());

describe("File Tests", () => {
  let url: string;
  test("upload file", async () => {
    const path = "/Users/asafnavon/Projects/Instant/Instant-Back/avatar.png";
    const response = await request(app)
      .post("/file/upload")
      .set("Authorization", "jwt " + token)
      .attach("file", path);
    expect(response.statusCode).toEqual(200);
    url = response.body.url;
  });
  test("upload file", async () => {
    const response = await request(app).get("/uploads/" + url.split("/")[4]);
    expect(response.statusCode).toEqual(200);
  });
});
