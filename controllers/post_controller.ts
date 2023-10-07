import Post from "../models/post_model.js";
import { Request, Response } from "express";

const get_posts = async (req: Request, res: Response) => {
  if (req.query.sender == null) {
    Post.find()
      .then((posts) => res.status(200).send(posts))
      .catch((error) =>
        res.status(400).send({
          status: "fail",
          message: error.message,
        })
      );
  } else {
    Post.find({ sender: req.query.sender })
      .then((posts) => res.status(200).send(posts))
      .catch((error) =>
        res.status(400).send({
          status: "fail",
          message: error.message,
        })
      );
  }
};

const get_post_by_id = async (req: Request, res: Response) => {
  Post.findById(req.params.id)
    .then((post) => res.status(200).send(post ? [post] : []))
    .catch((error) =>
      res.status(400).send({
        status: "fail",
        message: error.message,
      })
    );
};

const add_new_post = async (req: Request, res: Response) => {
  const post = new Post({
    message: req.body.message,
    sender: req.body.sender,
  });

  post
    .save()
    .then((new_post) => res.status(200).send(new_post))
    .catch((error) =>
      res.status(400).send({
        status: "fail",
        message: error.message,
      })
    );
};

const update_post = async (req: Request, res: Response) => {
  const post = new Post({
    _id: req.params.id,
    message: req.body.message,
    sender: req.body.sender,
  });
  Post.findByIdAndUpdate(req.params.id, post)
    .then((old_post) => {
      if (old_post) {
        res.sendStatus(200);
      } else {
        res.status(404).send({
          status: "post not found",
        });
      }
    })
    .catch((error) =>
      res.status(400).send({
        status: "failed",
        message: error.message,
      })
    );
};

export { get_posts, get_post_by_id, add_new_post, update_post };
