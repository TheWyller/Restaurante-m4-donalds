import { instanceToPlain } from "class-transformer";
import { Response, Request } from "express";
import getTableByIdService from "../../services/tables/getTableById.service";

const getTableByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const table = await getTableByIdService(id);
  
  return res.status(200).json(instanceToPlain(table));
};

export default getTableByIdController;
