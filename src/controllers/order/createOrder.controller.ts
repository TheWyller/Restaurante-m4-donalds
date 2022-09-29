import { Request, Response } from "express";
import createOrderServices from "../../services/order/createOrder.service";

const createOrderController = async (req: Request, res: Response) => {
  const { tableId } = req.body;
  const { id } = req.user;

  const newOrder = await createOrderServices({ tableId }, id);
  
  return res.status(201).json(newOrder);
};

export default createOrderController;
