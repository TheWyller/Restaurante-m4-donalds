import { Request, Response } from "express";
import { AppError } from "../../errors/AppErros";
import deleteUserService from "../../services/users/deleteUser.service";

const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;

  await deleteUserService(id);

  return res.status(200).json({ message: "Usuário deletado com sucesso!" });
};

export default deleteUserController;
