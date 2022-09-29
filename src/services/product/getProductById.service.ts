import AppDataSource from "../../data-source";
import { Products } from "../../entities/product.entity";
import { AppError } from "../../errors/AppErros";
import { IProduct } from "../../interfaces/product";

export const getProductByIdService = async ( id: number ): Promise<IProduct> => {
    const productsRepository = AppDataSource.getRepository(Products)
    const products = await productsRepository.find()
    const product = products.find(product => product.id === id)

    if (!product) {
        throw new AppError("Invalid ID", 404)
    }

    return product
}


