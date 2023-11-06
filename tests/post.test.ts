import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";
import Post from "../models/post_model.js";

const user = {
  identifier: "test",
  password: "Password123",
};
let tokens: { accessToken: string; refreshToken: string; userId: string };

beforeAll(async () => {
  tokens = (await request(app).post("/auth/login").send(user)).body;
});
afterAll(async () => {
  await Post.deleteMany({ owner: tokens.userId });
  await request(app)
    .get("/auth/logout")
    .set("Authorization", "jwt " + tokens.refreshToken)
    .send();
  await mongoose.connection.close();
});

describe("Post API tests", () => {
  const text = "this is my test post";
  let postId: string;

  test("add new post", async () => {
    const response = await request(app)
      .post("/post")
      .set("Authorization", "jwt " + tokens.accessToken)
      .send({ text: text });
    postId = response.body._id;
    expect(response.statusCode).toEqual(200);
    const newPost = response.body;
    expect(newPost.text).toEqual(text);
    const response2 = await request(app).get("/post/" + newPost._id);
    expect(response2.statusCode).toEqual(200);
    const post2 = response2.body;
    expect(post2.text).toEqual(text);
  });

  test("get all posts", async () => {
    const response = await request(app).get("/post");
    const posts = response.body;
    expect(response.statusCode).toEqual(200);
    expect(posts.length).toBeGreaterThan(0);
  });

  test("get post by id", async () => {
    const response = await request(app).get(`/post/${postId}`);
    const post = response.body;
    expect(response.statusCode).toEqual(200);
    expect(post.postId).toEqual(postId);
    expect(post.text).toEqual(text);
  });

  test("get posts by sender", async () => {
    const response = await request(app).get("/post?owner=test");
    const post = response.body[0];
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(post.postId).toEqual(postId);
    expect(post.text).toEqual(text);
  });

  test("update post", async () => {
    const response = await request(app)
      .put(`/post/${postId}`)
      .set("Authorization", "jwt " + tokens.accessToken)
      .send({
        text: "new message",
      });
    expect(response.statusCode).toEqual(200);
    const verification_response = await request(app).get(`/post/${postId}`);
    const post = verification_response.body;
    expect(post.postId).toEqual(postId);
    expect(post.text).toEqual("new message");
  });

  test("update non-existing post", async () => {
    const response = await request(app)
      .put(`/post/65080d84ca16c0f1f1ba116c`)
      .set("Authorization", "jwt " + tokens.accessToken)
      .send({ text: "new message" });
    expect(response.statusCode).toEqual(404);
  });
});
