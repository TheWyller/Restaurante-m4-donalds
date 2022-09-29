import AppDataSource from "../../data-source";
import { Tables } from "../../entities/table.entity";
import { ITableRequest } from "../../interfaces/table";

const createTableServices = async ({ size }: ITableRequest) => {
  const tableRepository = AppDataSource.getRepository(Tables);

  const table = new Tables();
  if (size) {
    table.size = size;
  }

  tableRepository.create(table);
  await tableRepository.save(table);

  return table;
};

export default createTableServices;
