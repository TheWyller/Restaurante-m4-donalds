import { Request, Response } from "express";
import { getProductByIdService } from "../../services/product/getProductById.service";

export const getProductByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    const product = await getProductByIdService(id)
    
    return res.status(200).json(product)
}

