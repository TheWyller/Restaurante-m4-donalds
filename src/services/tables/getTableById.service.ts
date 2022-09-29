import AppDataSource from "../../data-source";
import { Tables } from "../../entities/table.entity";
import { AppError } from "../../errors/AppErros";

const getTableByIdService = async (id: string) => {
  const tablesRepository = AppDataSource.getRepository(Tables);

  const table = await tablesRepository.findOne({
    relations: {
      order: true
    },
    where: {
      id: Number(id)
    }
  })

  if (!table) {
    throw new AppError("Table not found", 404);
  }

  if (table.inUse === true) {
    const subTotal = table.order.reduce((prev, current) => prev + Number(current.total), 0)
    table.subTotal = subTotal
    await tablesRepository.save(table)
  } else {
    table.subTotal = 0
    await tablesRepository.save(table)
  }

  const updatedTable = await tablesRepository.findOne({
    relations: {
      order: true
    },
    where: {
      id: Number(id)
    }
  })

  return updatedTable;
};

export default getTableByIdService;
