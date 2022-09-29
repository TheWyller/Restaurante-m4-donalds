import { IOrderProduct } from "../../interfaces/orderProduct";
import AppDataSource from "../../data-source";
import { AppError } from "../../errors/AppErros";
import { Products } from "../../entities/product.entity";
import { Order } from "../../entities/order.entity";
import { OrderProduct } from "../../entities/orderProduct.entity";
import { Tables } from "../../entities/table.entity";

const createOrderProductServices = async ({
  idProduct,
  idOrder,
}: IOrderProduct) => {
  const productRepository = AppDataSource.getRepository(Products);
  const orderRepository = AppDataSource.getRepository(Order);
  const orderProductRepository = AppDataSource.getRepository(OrderProduct);

  const product = await productRepository.findOneBy({
    id: idProduct,
  });
  const order = await orderRepository.findOne({
    relations: {
      table: true,
    },
    where: {
      id: idOrder,
    },
  });

  if (!order) {
    throw new AppError("Order doesn't exist");
  }
  const orderTableId = order.table.id;
  const tableRepository = AppDataSource.getRepository(Tables);
  const table = await tableRepository.findOneBy({ id: orderTableId });

  if (!table) {
    throw new AppError("Table doesn't exist");
  }

  if (!product || !order) {
    throw new AppError("Id product or order not exists", 404);
  }

  await orderProductRepository.save({
    order: order,
    product: product,
  });

  const updatedOrders = await orderRepository.find({
    relations: {
      orderProduct: true,
    },
  });
  const updatedOrder = updatedOrders.find((elem) => elem.id === idOrder);

  await orderRepository.update(idOrder, {
    total: updatedOrder?.orderProduct.reduce(
      (ac, elem) => elem.product.price + ac,
      0
    ),
  });

  await tableRepository.update(table.id, {
    subTotal: Number(table.subTotal) + Number(product.price),
  });
};

export default createOrderProductServices;
