import AppDataSource from "../data-source";
import { GroupUser } from "../entities/groupUser.entity";
import { User } from "../entities/user.entity";
import { hash } from "bcryptjs";

export const createGroup = async () => {
  try {
    const groupRepository = AppDataSource.getRepository(GroupUser);
    const groups = await groupRepository.find();
    if (groups.length === 0) {
      const admin = { name: "Administrador" };
      const user = { name: "Usuário" };
      const caixa = { name: "Caixa" };

      await groupRepository.save(admin);
      await groupRepository.save(user);
      await groupRepository.save(caixa);
      console.log("Repository ready");

      const admUserRepository = AppDataSource.getRepository(User);

      await admUserRepository.save({
        name: "root",
        email: "root@root.com",
        password: await hash("123456", 10),
        groupUser: admin,
      });
      console.log("AdmUser Created");
    }
  } catch (error) {
    console.log("Repository not ready yet");
  }
};
