import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/AppErros";

export const deleteUserService = async (id: any) => {
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();

  const account = users.find((user) => user.id === id);

  if (!account) {
    throw new AppError("User not found", 404);
  }

  if (!account.isActive) {
    throw new AppError("User already inative", 400);
  }

  account.isActive = false;
  userRepository.save(account);

  return account;
};

export default deleteUserService;
