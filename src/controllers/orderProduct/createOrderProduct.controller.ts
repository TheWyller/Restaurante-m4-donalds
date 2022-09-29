import { Request, Response } from "express";
import createOrderProductServices from "../../services/orderProduct/createOrderProduct.services";

const createOrderProductController = async (req: Request, res: Response) => {
  const { idProduct, idOrder } = req.body;

  await createOrderProductServices({ idProduct, idOrder });
  
  return res.status(201).json({ message: "Product set in Order with success" });
};

export default createOrderProductController;
