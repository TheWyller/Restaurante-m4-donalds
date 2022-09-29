import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Tables } from "./table.entity";
import { OrderProduct } from "./orderProduct.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
  total: number;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Tables, { eager: true })
  table: Tables;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProduct: OrderProduct[];
}
