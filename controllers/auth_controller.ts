import User from "../models/user_model.js";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Schema from "mongoose";
import sendError from "./helpers/send_error.js";
import dotenv from "dotenv";
dotenv.config();

const register = async (req: Request, res: Response) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (username == null) {
    return sendError(res, 400, "username missing");
  } else if (email == null) {
    return sendError(res, 400, "email missing");
  } else if (password == null) {
    return sendError(res, 400, "password missing");
  }

  try {
    let user = await User.findOne({ username: username });
    if (user) return sendError(res, 400, "username already taken");
    user = await User.findOne({ email: email });
    if (user) return sendError(res, 400, "email already used");
  } catch (err) {
    return sendError(res, 400, err);
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  const user = new User({
    username: username,
    email: email,
    password: password_hash,
    tokens: [],
  });

  user
    .save()
    .then(() => res.sendStatus(200))
    .catch(() => {
      sendError(res, 400, "registration failed please try againg later");
    });
};

const generateTokens = (_id: Schema.Types.ObjectId): [string, string] => {
  const access_token = jwt.sign({ _id: _id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION,
  });

  const refresh_token = jwt.sign({ _id: _id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });

  return [access_token, refresh_token];
};

const login = async (req: Request, res: Response) => {
  const identifier = req.body.identifier;
  const password = req.body.password;

  if (identifier == null) {
    return sendError(res, 400, "username or email missing");
  } else if (password == null) {
    return sendError(res, 400, "password missing");
  }

  try {
    let user = await User.findOne({ username: identifier });
    if (!user) user = await User.findOne({ email: identifier });
    if (!user) return sendError(res, 400, "incorrect identifier or password");

    if (!(await bcrypt.compare(password, user.password)))
      return sendError(res, 400, "incorrect identifier or password");

    const [access_token, refresh_token] = generateTokens(user._id);
    user.tokens.push(refresh_token);
    await user.save();
    res.status(200).send({
      accessToken: access_token,
      refreshToken: refresh_token,
      userId: user._id,
    });
  } catch (err) {
    return sendError(res, 400, "failed logging in please try againg later");
  }
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) return sendError(res, 401, "authentication missing");
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err && err.message == "jwt expired")
      return sendError(res, 403, err.message);
    if (err) return sendError(res, 403, "authentication failed");
    req.userId = user["_id"];
    next();
  });
};

const refresh = async (req: Request, res: Response) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) return sendError(res, 401, "authentication missing");
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, user) => {
    if (err && err.message == "jwt expired")
      return sendError(res, 403, err.message);
    if (err) return sendError(res, 403, err.message);

    await User.findById(user["_id"])
      .then(async (user) => {
        if (!user) return sendError(res, 403, "invalid request");

        if (!user.tokens.includes(token)) {
          user.tokens = [];
          await user.save();
          return sendError(res, 403, "invalid request");
        }

        const [access_token, refresh_token] = generateTokens(user._id);
        user.tokens[user.tokens.indexOf(token)] = refresh_token;
        await user.save();
        res.status(200).send({
          accessToken: access_token,
          refreshToken: refresh_token,
          userId: user._id,
        });
      })
      .catch((err) => sendError(res, 403, err));
  });
};

const logout = async (req: Request, res: Response) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) return sendError(res, 401, "authentication missing");
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, user) => {
    if (err && err.message == "jwt expired")
      return sendError(res, 403, err.message);
    if (err) return sendError(res, 403, "authentication failed");

    await User.findById(user["_id"])
      .then(async (user) => {
        if (!user) return sendError(res, 403, "invalid request");

        if (!user.tokens.includes(token)) {
          user.tokens = [];
          await user.save();
          return sendError(res, 403, "invalid request");
        }

        user.tokens.splice(user.tokens.indexOf(token), 1);
        await user.save();

        res.sendStatus(200);
      })
      .catch((err) => sendError(res, 403, err));
  });
};

export { register, login, authenticate, refresh, logout };
