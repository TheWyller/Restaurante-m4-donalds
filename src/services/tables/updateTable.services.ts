import AppDataSource from "../../data-source";
import { Tables } from "../../entities/table.entity";
import { AppError } from "../../errors/AppErros";
import { ITable } from "../../interfaces/table";

const updateTableServices = async ({ id, subTotal, size, inUse }: ITable) => {
  const tableRepository = AppDataSource.getRepository(Tables);
  const tables = await tableRepository.find();
  const table = tables.find((elem) => elem.id === id);
  if (!table) {
    throw new AppError("Invalid ID", 404);
  }
  if (subTotal) {
    await tableRepository.update(table.id, { subTotal: subTotal });
  }
  if (size) {
    await tableRepository.update(table.id, { size: size });
  }
  if (inUse !== undefined) {
    await tableRepository.update(table.id, { inUse: inUse });
  }

  const updatedTableRepository = AppDataSource.getRepository(Tables);
  const updatedTables = await updatedTableRepository.find();
  const updatedTable = updatedTables.find((elem) => elem.id === id);
  return updatedTable;
};

export default updateTableServices;
