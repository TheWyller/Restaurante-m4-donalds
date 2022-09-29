import { Request, Response, NextFunction } from "express";
import AppDataSource from "../data-source";
import { User } from "../entities/user.entity";

const idCheckMiddle = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.params;
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();

  const isIdExists = users.find((elem) => elem.id === id);

  if (isIdExists) {
    next();
  } else {
    return response.status(404).json({ message: "Invalid Id" });
  }
};

export default idCheckMiddle;
