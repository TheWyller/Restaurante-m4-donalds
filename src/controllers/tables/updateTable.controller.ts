import { Response, Request } from "express";
import updateTableServices from "../../services/tables/updateTable.services";

const updateTableController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { subTotal, size, inUse } = req.body;

  const updatedTable = await updateTableServices({ id, subTotal, size, inUse });
  
  return res.status(202).json(updatedTable);
};

export default updateTableController;
