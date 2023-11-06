import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";

const user = {
  identifier: "test",
  password: "Password123",
};
let tokens: { accessToken: string; refreshToken: string; userId: string };

beforeAll(async () => {
  tokens = (await request(app).post("/auth/login").send(user)).body;
});
afterAll(async () => {
  await request(app)
    .get("/auth/logout")
    .set("Authorization", "jwt " + tokens.refreshToken)
    .send();
  await mongoose.connection.close();
});

describe("File Tests", () => {
  let url: string;
  test("upload file", async () => {
    const path = "/Users/asafnavon/Projects/Instant/Instant-Back/avatar.png";
    const response = await request(app)
      .post("/file/upload/123456abcd")
      .set("Authorization", "jwt " + tokens.accessToken)
      .attach("file", path);
    expect(response.statusCode).toEqual(200);
    url = response.body.url;
  });

  test("download file", async () => {
    const response = await request(app).get("/uploads/" + url.split("/")[4]);
    expect(response.statusCode).toEqual(200);
  });
});
