import { Request, Response } from "express";
import { AppError } from "../../errors/AppErros";
import listUserService from "../../services/users/listUser.service";

const userListController = async (req: Request, res: Response) => {
  const users = await listUserService();

  return res.status(200).send(users);
};

export default userListController;