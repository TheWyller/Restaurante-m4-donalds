import { Request, Response } from "express";
import listProductService from "../../services/product/listProduct.service";

const listProductController = async (req: Request, res: Response) => {
  const products = await listProductService();

  return res.status(200).send(products);
};

export default listProductController;
