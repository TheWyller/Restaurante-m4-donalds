import AppDataSource from "../../data-source";
import { Order } from "../../entities/order.entity";
import { OrderProduct } from "../../entities/orderProduct.entity";
import { Tables } from "../../entities/table.entity";
import { AppError } from "../../errors/AppErros";

const deleteOrderProductServices = async (id: number) => {
  const orderProductRepository = AppDataSource.getRepository(OrderProduct);
  const orderRepository = AppDataSource.getRepository(Order);

  const orderProducts = await orderProductRepository.find({
    relations: {
      order: true,
    },
  });
  const orderProduct = orderProducts.find((elem) => elem.id === id);

  if (!orderProduct) {
    throw new AppError("Id not found", 404);
  }

  const updatedOrders = await orderRepository.find({
    relations: {
      orderProduct: true,
    },
  });
  const updatedOrder = updatedOrders.find(
    (elem) => elem.id === orderProduct.order.id
  );

  await orderRepository.update(orderProduct.order.id, {
    total: updatedOrder?.orderProduct.reduce(
      (ac, elem) => elem.product.price + ac,
      0
    ),
  });
  if (!updatedOrder) {
    throw new AppError("Order doesn't exists");
  }
  const orderTableId = updatedOrder.table.id;
  const tableRepository = AppDataSource.getRepository(Tables);
  const table = await tableRepository.findOneBy({ id: orderTableId });

  if (!table) {
    throw new AppError("Table doesn't exist");
  }

  await tableRepository.update(table.id, {
    subTotal: Number(table.subTotal) - Number(orderProduct.product.price),
  });
  await orderProductRepository.delete(orderProduct.id);
};

export default deleteOrderProductServices;
