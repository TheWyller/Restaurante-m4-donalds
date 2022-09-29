import { Response, Request } from "express";
import listTableServices from "../../services/tables/listTable.services";

const listTableController = async (req: Request, res: Response) => {
  const newTable = await listTableServices();
  
  return res.status(200).json(newTable);
};

export default listTableController;
