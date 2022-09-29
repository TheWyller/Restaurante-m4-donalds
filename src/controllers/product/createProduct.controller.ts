import { Request, Response } from "express";
import createProductService from "../../services/product/createProduct.service";

const createProductController = async (req: Request, res: Response) => {
  const { name, description, image, price, categoryId } = req.body;

  const newProduct = await createProductService({
    name,
    description,
    image,
    price,
    categoryId,
  });

  return res.status(201).send({
    message: "Produto criado com sucesso!",
    newProduct,
  });
};

export default createProductController;
