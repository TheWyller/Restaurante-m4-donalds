import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authUserMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let token = request.headers.authorization;

  if (token?.includes("Bearer")) {
    token = token.split(" ")[1];
  }

  jwt.verify(
    token as string,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return response.status(401).json({ message: "Invalid token" });
      }
      request.user = {
        isAdm: decoded.isAdm,
        id: decoded.id,
      };

      next();
    }
  );
};
export default authUserMiddleware;
