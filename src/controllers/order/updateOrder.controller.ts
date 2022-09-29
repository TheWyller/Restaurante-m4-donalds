import { Response, Request } from "express";
import updateOrderServices from "../../services/order/updateOrder.service";

const updateOrderController = async (req: Request, res: Response) => {
  const { tableId, isPaid, status } = req.body;
  const id = Number(req.params.id);

  const updatedOrder = await updateOrderServices(
    {
      tableId,
      isPaid,
      status,
    },
    id
  );
  
  return res.status(202).json(updatedOrder);
};

export default updateOrderController;
