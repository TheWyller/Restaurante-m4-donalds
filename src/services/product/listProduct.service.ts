import AppDataSource from "../../data-source";
import { Products } from "../../entities/product.entity";

const listProductService = async () => {
  const productRepository = AppDataSource.getRepository(Products);

  const products = productRepository.find();

  return products;
};

export default listProductService;
