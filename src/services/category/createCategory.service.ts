import AppDataSource from "../../data-source";
import { ICategory, ICategoryRequest } from "../../interfaces/category";
import { Categories } from "../../entities/category.entity";

export const createCategoryService = async ({
  name,
}: ICategoryRequest): Promise<ICategory> => {
  const categoryRepository = AppDataSource.getRepository(Categories);

  const category = await categoryRepository.save({ name });

  return category;
};

export default createCategoryService;
