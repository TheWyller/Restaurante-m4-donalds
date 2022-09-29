import { Request, Response } from "express";
import deleteOrderProductServices from "../../services/orderProduct/deleteOrderProduct.services";

const deleteOrderProductController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await deleteOrderProductServices(id);
  
  return res.status(202).json({ message: "Product deleted with success" });
};

export default deleteOrderProductController;
