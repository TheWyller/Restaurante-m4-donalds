import { Request, Response, NextFunction } from "express";
import AppDataSource from "../data-source";
import { User } from "../entities/user.entity";
import { AppError } from "../errors/AppErros";

const isAdmCheckMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userData = request.user;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id: userData.id });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (Number(user.groupUser.id) !== 1) {
    throw new AppError("You are not a Adm", 403);
  }

  next();
};

export default isAdmCheckMiddleware;
