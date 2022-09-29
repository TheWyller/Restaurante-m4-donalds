import AppDataSource from "../../data-source";
import { Tables } from "../../entities/table.entity";

const listTableServices = async () => {
  const tableRepository = AppDataSource.getRepository(Tables);
  const tables = await tableRepository.find({
    relations: {
      order: true,
    },
  });

  const modTables = tables.map((elem) => {
    const { order, ...tablesSemOrder } = elem;

    const newOrder = order.map((e) => {
      return { id: e.id, total: e.total, isPaid: e.isPaid, status: e.status };
    });

    const modTables = {
      order: newOrder,
      ...tablesSemOrder,
    };

    if (modTables.inUse === false) {
      modTables.subTotal = 0
    } else {
      const subTotal = modTables.order.reduce((prev, current) => prev + Number(current.total), 0)
      modTables.subTotal = subTotal
    }

    return modTables;
  });

  await tableRepository.save(modTables)

  return modTables;
};

export default listTableServices;
