import { Request, Response } from "express";
import getCategoryByIdService from "../../services/category/getCategoryById.service";

const getCategoryByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await getCategoryByIdService(id);

  return res.status(200).json(category);
};

export default getCategoryByIdController;
