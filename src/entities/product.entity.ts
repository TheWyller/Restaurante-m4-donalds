import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Categories } from "./category.entity";
import { OrderProduct } from "./orderProduct.entity";

@Entity("products")
export class Products {
  @PrimaryGeneratedColumn("increment")
  readonly id: number;

  @Column({ type: "varchar", unique: true, nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: true })
  description: string;

  @Column({ type: "varchar", nullable: true })
  image: string;

  @Column({ type: "float", nullable: false })
  price: number;

  @ManyToOne(() => Categories, { eager: true })
  category: Categories;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProduct: OrderProduct[];
}
