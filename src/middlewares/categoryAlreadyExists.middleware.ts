import { Response, Request, NextFunction } from "express";
import AppDataSource from "../data-source";
import { Categories } from "../entities/category.entity";
import { AppError } from "../errors/AppErros";

const categoryAlreadyExistsMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { name } = request.body;
  const categoryRepository = AppDataSource.getRepository(Categories);
  const categoryAlreadyExists = await categoryRepository.findOneBy({ name });

  if (categoryAlreadyExists) {
    throw new AppError("Category already exists");
  }

  next();
};

export default categoryAlreadyExistsMiddleware;
