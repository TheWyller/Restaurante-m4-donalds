import { Response, Request } from "express";
import createTableServices from "../../services/tables/createTable.services";

const createTableController = async (req: Request, res: Response) => {
  const { size } = req.body;

  const newTable = await createTableServices({ size });
  
  return res.status(201).json(newTable);
};

export default createTableController;
