import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";
import { Tables } from "../../entities/table.entity";
import { AppError } from "../../errors/AppErros";
import { IOrderUpdate } from "../../interfaces/order";

const updateOrderServices = async (
  { tableId, isPaid, status }: IOrderUpdate,
  orderId: number
) => {
  const orderRepository = AppDataSource.getRepository(Order);
  const tablesRepository = AppDataSource.getRepository(Tables);

  const order = await orderRepository.findOneBy({
    id: orderId,
  });

  if (!order) {
    throw new AppError("invalid Order ID", 404);
  }

  if (tableId) {
    const table = await tablesRepository.findOneBy({
      id: tableId,
    });

    if (!table) {
      throw new AppError("invalid Table ID", 404);
    }
    if (tableId !== undefined) {
      await orderRepository.update(order.id, { table: table });
    }
  }

  if (status) {
    await orderRepository.update(order.id, { status: status });
  }

  if (isPaid !== undefined) {
    await orderRepository.update(order.id, { isPaid: isPaid });
    await orderRepository.update(order.id, { status: !isPaid });
  }

  const tables = await tablesRepository.find({
    relations: { order: true },
  });
  const aTable = tables.find((elem) => elem.id === order.table.id);

  const checkTables = aTable?.order.filter((elem) => elem.status === true);

  if (checkTables?.length === 0) {
    await tablesRepository.update(order.table.id, { inUse: false });
  } else {
    await tablesRepository.update(order.table.id, { inUse: true });
  }

  await orderRepository.update(order.id, { updatedAt: new Date() });

  const updatedOrderRepository = AppDataSource.getRepository(Order);
  const updatedOrders = await updatedOrderRepository.find({
    relations: {
      orderProduct: true,
    },
  });
  const updatedOrder = updatedOrders.find((elem) => elem.id === orderId);

  return updatedOrder;
};

export default updateOrderServices;
