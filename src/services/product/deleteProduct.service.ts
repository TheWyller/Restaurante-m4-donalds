import AppDataSource from "../../data-source";
import { Products } from "../../entities/product.entity";
import { AppError } from "../../errors/AppErros";

const deleteProductService = async (id:string): Promise<void> => {
  const productRepository = AppDataSource.getRepository(Products);

  const productToDeleted = await productRepository.findOneBy({ id: Number(id) });

  if (!productToDeleted) {
    throw new AppError("Product not found!", 400);
  }

  await productRepository.delete(productToDeleted);

  return;
};

export default deleteProductService;
