import AppDataSource from "../../data-source";
import { IUser, IUserRequest } from "../../interfaces/users";
import { User } from "../../entities/user.entity";
import { GroupUser } from "../../entities/groupUser.entity";
import { AppError } from "../../errors/AppErros";
import { hash } from "bcryptjs";

export const createUserService = async (
  userData: IUserRequest
): Promise<IUser> => {
  const userRepository = AppDataSource.getRepository(User);
  const groupRepository = AppDataSource.getRepository(GroupUser);

  const { email, groupName, name } = { ...userData };

  const group = await groupRepository.findOneBy({ name: groupName });
  const hashedPassword = await hash(userData.password, 10);

  if (!group) {
    throw new AppError("Group user not found", 404);
  }

  const user = new User();
  user.email = email;
  user.groupUser = group;
  user.name = name;
  user.password = hashedPassword;

  await userRepository.save(user);

  return user;
};

export default createUserService;
