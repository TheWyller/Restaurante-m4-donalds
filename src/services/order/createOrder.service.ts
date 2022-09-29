import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";
import { Tables } from "../../entities/table.entity";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/AppErros";
import { IOrderRequest } from "../../interfaces/order";

const createOrderServices = async (
  { tableId }: IOrderRequest,
  userId: string
) => {
  const orderRepository = AppDataSource.getRepository(Order);
  const userRepository = AppDataSource.getRepository(User);
  const tableRepository = AppDataSource.getRepository(Tables);

  const users = await userRepository.find();
  const tables = await tableRepository.find();

  const user = users.find((elem) => elem.id === userId);
  const table = tables.find((elem) => elem.id === tableId);

  if (!table) {
    throw new AppError("Id products not exists", 404);
  }

  const order = orderRepository.create({
    user: user,
    table: table,
  });

  await tableRepository.update(table.id, { inUse: true });

  await orderRepository.save(order);

  const { user: newUser, ...orderSemUser } = order;

  const modOrder = {
    user: { id: order.user.id, name: order.user.name },
    ...orderSemUser,
  };

  return modOrder;
};

export default createOrderServices;
