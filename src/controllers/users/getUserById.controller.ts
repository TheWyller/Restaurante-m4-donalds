import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import { getUserByIdService } from "../../services/users/getUserById.service";

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await getUserByIdService(id);
  
  return res.status(200).json(instanceToPlain(user));
};

