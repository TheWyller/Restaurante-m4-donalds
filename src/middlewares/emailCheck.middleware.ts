import { Request, Response, NextFunction } from "express";
import AppDataSource from "../data-source";
import { User } from "../entities/user.entity";

const emailCheckMiddle = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userData = request.body;
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();
  const isEmailExists = users.find((elem) => elem.email === userData.email);

  if (isEmailExists) {
    return response.status(400).json({ message: "Email already exist" });
  } else {
    next();
  }
};

export default emailCheckMiddle;
