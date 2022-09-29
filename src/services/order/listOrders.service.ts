import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";

const listOrdersServices = async () => {
  const OrderRepository = AppDataSource.getRepository(Order);
  const Orders = await OrderRepository.find();

  const modOrders = Orders.map((elem) => {
    const { user, ...orderSemUser } = elem;

    const modOrder = {
      user: { id: elem.user.id, name: elem.user.name },
      ...orderSemUser,
    };
    return modOrder;
  });

  return modOrders;
};

export default listOrdersServices;
