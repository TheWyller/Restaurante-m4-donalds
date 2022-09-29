import AppDataSource from "../../data-source";
import { ICategory } from "../../interfaces/category";
import { Categories } from "../../entities/category.entity";

export const listCategoryService = async (): Promise<ICategory[]> => {
  const categoryRepository = AppDataSource.getRepository(Categories);
  const categories = await categoryRepository.find();

  return categories;
};

export default listCategoryService;
