import { Request, Response } from "express";
import updateCategoryService from "../../services/category/updateCategory.service";

const updateCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await updateCategoryService(id, name);

  return res.status(202).json(category);
};

export default updateCategoryController;
