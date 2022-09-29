export interface IProductRequest {
  name: string;
  description: string;
  image: string;
  price: string;
  categoryId: string;
}
export interface IProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  categoryId?: string;
}
