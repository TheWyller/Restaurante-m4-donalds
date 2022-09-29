import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/AppErros";
import { IUser } from "../../interfaces/users";

export const getUserByIdService = async ( id: string ): Promise<IUser> => {
    const usersRepository = AppDataSource.getRepository(User)
    const users = await usersRepository.find()
    const user = users.find(user => user.id === id)

    if (!user) {
        throw new AppError("Invalid ID", 404)
    }

    return user
}

