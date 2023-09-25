import Post from "../models/post_model.js";

const get_posts = async (req, res, next) => {
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

const get_post_by_id = async (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => res.status(200).send(post))
    .catch((error) =>
      res.status(400).send({
        status: "fail",
        message: error.message,
      })
    );
};

const add_new_post = async (req, res, next) => {
  const post = Post({
    message: req.body.message,
    sender: req.body.sender,
  });

  post
    .save()
    .then((new_post) =>
      res.status(200).send({
        status: "ok",
        post: new_post,
      })
    )
    .catch((error) =>
      res.status(400).send({
        status: "fail",
        message: error.message,
      })
    );
};

const update_post = async (req, res, next) => {
  const post = Post({
    _id: req.params.id,
    message: req.body.message,
    sender: req.body.sender,
  });

  Post.updateOne(post)
    .then((updated_post) =>
      res.status(200).send({
        status: "ok",
        post: updated_post,
      })
    )
    .catch((error) =>
      res.status(400).send({
        status: "fail",
        message: error.message,
      })
    );
};

export { get_posts, get_post_by_id, add_new_post, update_post };
