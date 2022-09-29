import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/AppErros";

export const listOrdersByUserIdService = async (id: string): Promise<any/*IOrder[]*/> => {
    const usersRepository = AppDataSource.getRepository(User)
    const users = await usersRepository.find()
    const user = users.find(user => user.id === id)

    if (!user) {
        throw new AppError("User not found", 404)
    }

    const userOrders = await usersRepository.findOne({
        relations: {
            orders: true
        },
        where: {
            id: user.id
        }
    })

    return userOrders
}

