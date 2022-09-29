import AppDataSource from "../../data-source";
import { Categories } from "../../entities/category.entity";
import { ICategory } from "../../interfaces/category";
import { AppError } from "../../errors/AppErros";

export const updateCategoryService = async (
  id: string,
  name: string
): Promise<ICategory> => {
  const categoryRepository = AppDataSource.getRepository(Categories);

  const category = await categoryRepository.findOneBy({ id: Number(id) });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  category.name = name;

  await categoryRepository.save(category);

  return category;
};

export default updateCategoryService;
