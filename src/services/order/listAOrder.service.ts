import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";
import { AppError } from "../../errors/AppErros";

const listAOrderServices = async (id: number) => {
  const orderRepository = AppDataSource.getRepository(Order);
  const orders = await orderRepository.find({
    relations: {
      orderProduct: true,
    },
  });
  const order = orders.find((elem) => elem.id === id);

  if (!order) {
    throw new AppError("Invalid ID", 404);
  }

  const { user: newUser, ...orderSemUser } = order;

  const modOrder = {
    user: { id: order.user.id, name: order.user.name },
    ...orderSemUser,
  };
  return modOrder;
};

export default listAOrderServices;
