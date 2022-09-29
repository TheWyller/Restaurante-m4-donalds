import { IProductRequest } from "./../../interfaces/product/index";
import AppDataSource from "../../data-source";
import { Categories } from "../../entities/category.entity";
import { Products } from "../../entities/product.entity";
import { AppError } from "../../errors/AppErros";

export const updateProductService = async (
  userData: IProductRequest,
  id: string
) => {
  const productRepository = AppDataSource.getRepository(Products);
  const categoryRepository = AppDataSource.getRepository(Categories);

  const { name, description, image, price, categoryId } = { ...userData };

  const productToUpdate = await productRepository.findOneBy({
    id: Number(id),
  });
  const category = await categoryRepository.findOneBy({
    id: Number(categoryId),
  });

  if (!productToUpdate) {
    throw new AppError("Product not found", 400);
  }

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const productAlreadExists = await productRepository.findOneBy({
    name,
  });

  if (productAlreadExists) {
    throw new AppError("Product already exists");
  }

  productToUpdate.name = name;
  productToUpdate.description = description;
  productToUpdate.image = image;
  productToUpdate.price = Number(price);
  productToUpdate.category = category;

  await productRepository.save(productToUpdate);

  return productToUpdate;
};

export default updateProductService;
