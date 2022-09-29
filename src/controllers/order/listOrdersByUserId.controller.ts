import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import { listOrdersByUserIdService } from "../../services/order/listOrdersByUserId.service";


export const listOrdersByUserIdController = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await listOrdersByUserIdService(id)
    user?.orders.forEach((order: { user: any; }) => {
        delete order.user
    })
    
    return res.status(200).json(instanceToPlain(user))
}

