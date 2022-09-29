import { IOrder } from "../../interfaces/order";
import { IOrderProduct } from "../../interfaces/orderProduct";

export const mockedOrderProduct: IOrderProduct = {
  idOrder: 1,
  idProduct: 1,
};

export const mockedOrderAdmin: IOrder = {
  id: "1",
  total: 0,
  isPaid: false,
  userId: "1",
  tableId: 3,
  products: [3],
};

export const mockedOrderNoAdmin: IOrder = {
  id: "2",
  total: 33,
  isPaid: true,
  userId: "2",
  tableId: 4,
  products: [1],
};

export const mockedOrderProductAdmin: IOrderProduct = {
  idProduct: 1,
  idOrder: 1,
};

export const mockedOrderProductAdmin2: IOrderProduct = {
  idProduct: 4,
  idOrder: 1,
};

export const mockedOrderProductAdmin3: IOrderProduct = {
  idProduct: 6,
  idOrder: 1,
};

export const mockedOrderProductAdmin4: IOrderProduct = {
  idProduct: 2,
  idOrder: 1,
};

export const mockedOrderProductAdmin5: IOrderProduct = {
  idProduct: 3,
  idOrder: 1,
};

export const mockedOrderProductAdmin6: IOrderProduct = {
  idProduct: 4,
  idOrder: 1,
};

export const mockedOrderProductAdmin7: IOrderProduct = {
  idProduct: 12,
  idOrder: 1,
};

export const mockedOrderProductNoAdmin: IOrderProduct = {
  idProduct: 2,
  idOrder: 2,
};
export const mockedOrderProductNoAdmin2: IOrderProduct = {
  idProduct: 2,
  idOrder: 2,
};
export const mockedOrderProductNoAdmin3: IOrderProduct = {
  idProduct: 2,
  idOrder: 2,
};
export const mockedOrderProductNoAdmin4: IOrderProduct = {
  idProduct: 2,
  idOrder: 2,
};

