import { Response, Request, NextFunction } from "express";
import AppDataSource from "../data-source";
import { Categories } from "../entities/category.entity";
import { AppError } from "../errors/AppErros";

const categoryNotFoundMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.params;
  const categoryRepository = AppDataSource.getRepository(Categories);
  const categoryNotFound = await categoryRepository.findOneBy({
    id: Number(id),
  });

  if (!categoryNotFound) {
    throw new AppError("Category not found", 404);
  }

  next();
};

export default categoryNotFoundMiddleware;
