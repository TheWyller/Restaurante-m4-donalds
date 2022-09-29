import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { GroupUser } from "../../entities/groupUser.entity";
import bcrypt from "bcryptjs";
import { IUserRequest } from "../../interfaces/users";
import { AppError } from "../../errors/AppErros";

const updateUserService = async (id: string, data: IUserRequest) => {
  const userRepository = AppDataSource.getRepository(User);
  const groupRepository = AppDataSource.getRepository(GroupUser);

  const users = await userRepository.find();

  const account = users.find((user) => user.id === id);
  if (!account) {
    throw new AppError("User not found", 404);
  }

  if (data.groupName) {
    const group = await groupRepository.findOneBy({ name: data.groupName });

    if (!group) {
      throw new AppError("Group user not found", 404);
    }

    account.groupUser = group;
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
    account.password = data.password;
  }

  const { groupName, ...newData } = data;
  await userRepository.update(id, {
    ...newData,
    groupUser: account.groupUser,
    password: account.password,
    updatedAt: new Date(),
  });

  const updatedUserRepository = AppDataSource.getRepository(User);
  const updatedUsers = await updatedUserRepository.find();
  const updatedUser = updatedUsers.find((elem) => elem.id === id);

  return updatedUser;
};

export default updateUserService;
