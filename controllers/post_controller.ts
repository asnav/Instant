import Post from "../models/post_model.js";
import User from "../models/user_model.js";
import { Request, Response } from "express";
import sendError from "./helpers/send_error.js";
import { Types } from "mongoose";

const get_posts = async (req: Request, res: Response) => {
  //in the future: implement an algorithm to get relevant posts for the requesting user instead of getting all posts from the db.
  if (req.query.owner == null) {
    await Post.find()
      .then((posts) => res.status(200).send(posts))
      .catch(() =>
        sendError(res, 400, "failed retrieving posts, please try again later")
      );
  } else {
    let ownerId: Types.ObjectId;
    try {
      const owner = await User.findOne({ username: req.query.owner });
      if (owner) ownerId = owner._id;
      else return sendError(res, 400, "owner doesn't exist");
    } catch {
      sendError(res, 400, "failed finding owner, please try again later");
    }

    Post.find({ owner: ownerId })
      .then((posts) => res.status(200).send(posts))
      .catch(() =>
        sendError(res, 400, "failed retrieving posts, please try again later")
      );
  }
};

const get_post_by_id = async (req: Request, res: Response) => {
  Post.findById(req.params.id)
    .then((post) => {
      post ? res.status(200).send(post) : sendError(res, 404, "post not found");
    })
    .catch(() =>
      sendError(res, 400, "failed retrieving post, please try again later")
    );
};

const add_new_post = async (req: Request, res: Response) => {
  if (!req.body.text) return sendError(res, 400, "post missing");
  const post = new Post({
    text: req.body.text,
    owner: req.userId,
  });

  post
    .save()
    .then((post) => res.status(200).send(post))
    .catch(() =>
      sendError(res, 400, "failed saving post, please try again later")
    );
};

const update_post = async (req: Request, res: Response) => {
  if (!req.body.text) return sendError(res, 400, "post missing");

  const post = new Post({
    _id: req.params.id,
    text: req.body.text,
    owner: req.userId,
  });
  Post.findByIdAndUpdate(req.params.id, post)
    .then((old_post) => {
      if (old_post) res.sendStatus(200);
      else sendError(res, 404, "post not found");
    })
    .catch(() =>
      sendError(res, 400, "failed updating post, please try again later ")
    );
};

export { get_posts, get_post_by_id, add_new_post, update_post };
