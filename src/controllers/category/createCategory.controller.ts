import { Request, Response } from "express";
import { ICategoryRequest } from "../../interfaces/category";
import createCategoryService from "../../services/category/createCategory.service";

const createCategoryController = async (req: Request, res: Response) => {
  const categoryData: ICategoryRequest = req.body;
  const category = await createCategoryService(categoryData);

  return res.status(201).json(category);
};

export default createCategoryController;
