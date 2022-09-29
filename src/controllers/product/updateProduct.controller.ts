import { IProductRequest } from './../../interfaces/product/index';
import { Request, Response } from "express";
import updateProductService from '../../services/product/updateProduct.service';

const updateProductController = async (req: Request, res: Response) => {
  const productData: IProductRequest = req.body;
  const {id} = req.params
  
  const product = await updateProductService(productData, id)

  return res.status(201).json(product);
};

export default updateProductController;
