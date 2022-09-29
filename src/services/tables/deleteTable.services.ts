import AppDataSource from "../../data-source";
import { Tables } from "../../entities/table.entity";
import { AppError } from "../../errors/AppErros";

const deleteTableServices = async (id: number) => {
  const tableRepository = AppDataSource.getRepository(Tables);
  const tables = await tableRepository.find();
  const table = tables.find((elem) => elem.id === id);
  if (!table) {
    throw new AppError("Invalid ID", 404);
  }

  await tableRepository.delete(table.id);

  return { message: "Table deleted" };
};

export default deleteTableServices;
