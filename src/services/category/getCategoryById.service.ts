import AppDataSource from "../../data-source";
import { ICategory } from "../../interfaces/category";
import { Categories } from "../../entities/category.entity";

export const getCategoryByIdService = async (id: string): Promise<ICategory> => {
  const categoryRepository = AppDataSource.getRepository(Categories);
  const category = await categoryRepository.findOneBy({ id: Number(id) });

  return category!;
};

export default getCategoryByIdService;
