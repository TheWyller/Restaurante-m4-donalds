import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";
import { Tables } from "../../entities/table.entity";
import { AppError } from "../../errors/AppErros";

const deleteOrderServices = async (id: number) => {
  const orderRepository = AppDataSource.getRepository(Order);
  const order = await orderRepository.findOneBy({
    id: id,
  });

  if (!order) {
    throw new AppError("Order id not found", 404);
  }

  const tablesRepository = AppDataSource.getRepository(Tables);
  const tables = await tablesRepository.find({
    relations: {
      order: true,
    },
  });
  const table = tables.find((elem) => elem.id === order.table.id);

  if (!table) {
    throw new AppError("Table id not found", 404);
  }

  await orderRepository.update(order.id, { status: false });

  if (table.order.filter((elem) => elem.status === true).length === 0) {
    await tablesRepository.update(table.id, { inUse: false });
  }

  const updatedTables = await tablesRepository.find({
    relations: {
      order: true,
    },
  });
  const updatedTable = updatedTables.find((elem) => elem.id === order.table.id);

  const checkTables = updatedTable?.order.filter(
    (elem) => elem.status === true
  );

  if (checkTables?.length === 0) {
    await tablesRepository.update(order.table.id, { inUse: false });
  } else {
    await tablesRepository.update(order.table.id, { inUse: true });
  }
};

export default deleteOrderServices;
