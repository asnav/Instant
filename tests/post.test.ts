import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";
import Post from "../models/post_model.js";
import User from "../models/user_model.js";

const user = {
  username: "user",
  email: "user@email.com",
  password: "Password123",
};
let token: string;

beforeAll(async () => {
  await User.deleteMany();
  await Post.deleteMany();
  await request(app).post("/auth/register").send(user);
  token = (
    await request(app).post("/auth/login").send({
      identifier: user.username,
      password: user.password,
    })
  ).body.access_token;
});

afterAll(async () => {
  await User.deleteMany();
  await Post.deleteMany();
  await mongoose.connection.close();
});

describe("Testing Post API", () => {
  const postMessage = "this is my test post";
  let postID: string;

  test("add new post", async () => {
    const response = await request(app)
      .post("/post")
      .set("Authorization", "jwt " + token)
      .send({
        message: postMessage,
        sender: user.username,
      });
    postID = response.body._id;
    expect(response.statusCode).toEqual(200);
    const newPost = response.body;
    expect(newPost.message).toEqual(postMessage);
    const response2 = await request(app).get("/post/" + newPost._id);
    expect(response2.statusCode).toEqual(200);
    const post2 = response2.body[0];
    expect(post2.message).toEqual(postMessage);
  });

  test("get all posts", async () => {
    const response = await request(app).get("/post");
    const post = response.body[0];
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(post._id).toEqual(postID);
    expect(post.message).toEqual(postMessage);
    expect(post.sender).toEqual(user.username);
  });

  test("get post by id", async () => {
    const response = await request(app).get(`/post/${postID}`);
    const post = response.body[0];
    expect(response.statusCode).toEqual(200);
    expect(post._id).toEqual(postID);
    expect(post.message).toEqual(postMessage);
    expect(post.sender).toEqual(user.username);
  });

  test("get posts by sender", async () => {
    const response = await request(app).get("/post?sender=user");
    const post = response.body[0];
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(post._id).toEqual(postID);
    expect(post.message).toEqual(postMessage);
    expect(post.sender).toEqual(user.username);
  });

  test("update post", async () => {
    const response = await request(app)
      .put(`/post/${postID}`)
      .set("Authorization", "jwt " + token)
      .send({
        message: "new message",
        sender: "new sender",
      });
    expect(response.statusCode).toEqual(200);
    const verification_response = await request(app).get(`/post/${postID}`);
    const post = verification_response.body[0];
    expect(post._id).toEqual(postID);
    expect(post.message).toEqual("new message");
    expect(post.sender).toEqual("new sender");
  });

  test("update non-existing post", async () => {
    const response = await request(app)
      .put(`/post/65080d84ca16c0f1f1ba116c`)
      .set("Authorization", "jwt " + token)
      .send({
        message: "new message",
        sender: "new sender",
      });
    expect(response.statusCode).toEqual(404);
  });
});
