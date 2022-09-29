import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import updateUserService from "../../services/users/updateUser.service";

const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { name, email, password, isActive, groupName } = req.body;

  const data = {
    name,
    email,
    password,
    isActive,
    groupName,
  };

  const user = await updateUserService(id, data);

  return res.status(200).json(instanceToPlain(user));
};

export default updateUserController;
