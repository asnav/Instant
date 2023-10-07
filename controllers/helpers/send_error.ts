import { Response } from "express";

const sendError = async (res: Response, code: number, err: string) => {
  res.status(code).send({
    status: "failed",
    message: err,
  });
};

export default sendError;
