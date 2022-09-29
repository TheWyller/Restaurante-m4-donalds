export interface IOrderRequest {
  tableId: number;
}

export interface IOrder {
  id?: string;
  total?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isPaid: boolean;
  userId?: string;
  tableId?: number;
  products?: number[];
}

export interface IOrderUpdate {
  isPaid: boolean;
  tableId?: number;
  status?: boolean;
}
