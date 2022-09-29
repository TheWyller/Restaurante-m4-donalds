import AppDataSource from "../../data-source";
import { Categories } from "../../entities/category.entity";

export const deleteCategoryService = async (id: string): Promise<void> => {
  const categoryRepository = AppDataSource.getRepository(Categories);

  const category = await categoryRepository.findOneBy({ id: Number(id) });

  if (category) {
    await categoryRepository.delete(category);
  }
  return;
};

export default deleteCategoryService;
