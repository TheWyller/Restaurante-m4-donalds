import { Response, Request } from "express";
import listAOrderServices from "../../services/order/listAOrder.service";

const listAOrderController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const newTable = await listAOrderServices(id);
  return res.status(200).json(newTable);
};

export default listAOrderController;
