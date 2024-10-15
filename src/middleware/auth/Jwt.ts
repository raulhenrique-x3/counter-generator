import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
dotenv.config({ path: "./src/.env" });

interface IDecode {
  id: string;
  token: string;
}

export interface RequestWithUserRole extends Request {
  user?: IDecode | any;
}

export const verifyToken = (
  req: RequestWithUserRole,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decode = jwt.verify(token!, process.env.JWT_KEY!);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Falha na autenticação", error });
  }
};
