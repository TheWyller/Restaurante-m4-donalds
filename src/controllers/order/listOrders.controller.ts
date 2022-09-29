import { Response, Request } from "express";
import listOrdersServices from "../../services/order/listOrders.service";

const listOrdersController = async (req: Request, res: Response) => {
  const newTable = await listOrdersServices();
  return res.status(200).json(newTable);
};

export default listOrdersController;
