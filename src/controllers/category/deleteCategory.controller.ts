import { Request, Response } from "express";
import deleteCategoryService from "../../services/category/deleteCategory.service";

const deleteCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteCategoryService(id);

  return res.status(200).json({ message: "Category delete" });
};

export default deleteCategoryController;
