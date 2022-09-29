import { Request, Response } from "express";
import deleteOrderServices from "../../services/order/deleteOrder.services";

const deleteOrderController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await deleteOrderServices(id);
  
  return res.status(202).json({ message: "Order deleted with success" });
};

export default deleteOrderController;
