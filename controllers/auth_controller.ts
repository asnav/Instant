import User from "../models/user_model.js";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const sendError = async (res, err) => {
  res.status(400).send({
    status: "failed",
    message: err,
  });
};

const register = async (req: Request, res: Response) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (username == null) {
    return sendError(res, "username missing");
  } else if (email == null) {
    return sendError(res, "email missing");
  } else if (password == null) {
    return sendError(res, "password missing");
  }

  try {
    let user = await User.findOne({ username: username });
    if (user) return sendError(res, "username already taken");
    user = await User.findOne({ email: email });
    if (user) return sendError(res, "email already used");
  } catch (err) {
    return sendError(res, err);
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  const user = new User({
    username: username,
    email: email,
    password: password_hash,
  });

  user
    .save()
    .then((user_object) => res.status(200).send(user_object))
    .catch((err) => {
      sendError(res, err);
    });
};

const login = async (req: Request, res: Response) => {
  const identifier = req.body.identifier;
  const password = req.body.password;

  if (identifier == null) {
    return sendError(res, "username or email missing");
  } else if (password == null) {
    return sendError(res, "password missing");
  }

  try {
    let user = await User.findOne({ username: identifier });
    if (!user) user = await User.findOne({ email: identifier });
    if (!user) return sendError(res, "incorrect identifier or password");

    if (!(await bcrypt.compare(password, user.password)))
      return sendError(res, "incorrect identifier or password");

    const access_token = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    );
    res.status(200).send({ access_token: access_token });
  } catch (err) {
    return sendError(res, err);
  }
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers["authorization"];
  if (authHeaders) {
    const token = authHeaders && authHeaders.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send(err.message);
      console.log(user);
      //req.user = user;
      next();
    });
  } else return res.sendStatus(401);
};

const logout = async (req: Request, res: Response) => {
  console.log("logout");
  sendError(res, "not implemented");
};

export { register, login, authenticate, logout };
