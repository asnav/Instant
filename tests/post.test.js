import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import Post from "../models/post_model.js";

beforeAll(async () => {
  await Post.deleteMany();
});

afterAll(async () => {
  await Post.deleteMany();
  await mongoose.connection.close();
});

describe("Testing Post API", () => {
  const postMessage = "this is my test post";
  const sender = "Asaf";
  let postID;

  test("add new post", async () => {
    const response = await request(app).post("/post").send({
      message: postMessage,
      sender: sender,
    });
    postID = response.body.post._id;
    expect(response.statusCode).toEqual(200);
    const newPost = response.body.post;
    expect(newPost.message).toEqual(postMessage);
    const response2 = await request(app).get("/post/" + newPost._id);
    expect(response2.statusCode).toEqual(200);
    const post2 = response2.body;
    expect(post2.message).toEqual(postMessage);
  });

  test("get all posts", async () => {
    const response = await request(app).get("/post");
    expect(response.statusCode).toEqual(200);
    expect(response.body[0]._id).toEqual(postID);
    expect(response.body[0].message).toEqual(postMessage);
    expect(response.body[0].sender).toEqual(sender);
    expect(response.body.length).toEqual(1);
  });

  test("get post by id", async () => {
    const response = await request(app).get(`/post/${postID}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body._id).toEqual(postID);
    expect(response.body.message).toEqual(postMessage);
    expect(response.body.sender).toEqual(sender);
  });

  test("get posts by sender", async () => {
    const response = await request(app).get("/post?sender=Asaf");
    expect(response.statusCode).toEqual(200);
    expect(response.body[0]._id).toEqual(postID);
    expect(response.body[0].message).toEqual(postMessage);
    expect(response.body[0].sender).toEqual(sender);
    expect(response.body.length).toEqual(1);
  });

  test("update post", async () => {
    const response = await request(app).put(`/post/${postID}`).send({
      message: "new message",
      sender: "new sender",
    });
    expect(response.statusCode).toEqual(200);
    const verification_response = await request(app).get(`/post/${postID}`);
    expect(verification_response.body._id).toEqual(postID);
    expect(verification_response.body.message).not.toEqual(postMessage);
    expect(verification_response.body.sender).not.toEqual(sender);
    expect(verification_response.body.message).toEqual("new message");
    expect(verification_response.body.sender).toEqual("new sender");
  });
});
