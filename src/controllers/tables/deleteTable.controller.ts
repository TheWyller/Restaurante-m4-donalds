import { Response, Request } from "express";
import deleteTableServices from "../../services/tables/deleteTable.services";

const deleteTableController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleteTable = await deleteTableServices(Number(id));
  
  return res.status(200).json({message: "Table deleted!"});
};

export default deleteTableController;
