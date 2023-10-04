import { Request, Response } from "express";

const login = async (req: Request, res: Response) => {
  console.log("login");
  res.status(400).send({
    status: "fail",
    message: "not implemented",
  });
};

const register = async (req: Request, res: Response) => {
  console.log("register");
  res.status(400).send({
    status: "fail",
    message: "not implemented",
  });
};

const logout = async (req: Request, res: Response) => {
  console.log("logout");
  res.status(400).send({
    status: "fail",
    message: "not implemented",
  });
};

export { login, register, logout };
