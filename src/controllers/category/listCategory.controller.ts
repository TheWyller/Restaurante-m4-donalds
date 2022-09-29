import { Request, Response } from "express";
import listCategoryService from "../../services/category/listCategory.service";

const listCategoryController = async (req: Request, res: Response) => {
  const categories = await listCategoryService();

  return res.status(200).json(categories);
};

export default listCategoryController;
