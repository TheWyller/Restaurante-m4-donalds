import { IProduct, IProductRequest } from "./../../interfaces/product/index";
import AppDataSource from "../../data-source";
import { AppError } from "../../errors/AppErros";
import { Products } from "../../entities/product.entity";
import { Categories } from "../../entities/category.entity";

export const createProductService = async ({
  name,
  description,
  image,
  price,
  categoryId,
}: IProductRequest): Promise<IProduct> => {
  const productsRepository = AppDataSource.getRepository(Products);

  const categoriesRepository = AppDataSource.getRepository(Categories);

  const category = await categoriesRepository.findOne({
    where: {
      id: parseInt(categoryId),
    },
  });

  if (!category) {
    throw new AppError("Category is not found!", 400);
  }

  const productAlreadExists = await productsRepository.findOneBy({
    name,
  });

  if (productAlreadExists) {
    throw new AppError("Product already exists");
  }

  const newProduct = new Products();
  newProduct.name = name;
  newProduct.description = description;
  newProduct.image = image;
  newProduct.price = parseFloat(price);
  newProduct.category = category;

  await productsRepository.save(newProduct);

  return newProduct;
};

export default createProductService;
