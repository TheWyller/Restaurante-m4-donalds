import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity("tables")
export class Tables {
  @PrimaryGeneratedColumn("increment")
  readonly id: number;

  @Column({ type: "decimal", precision: 8, scale: 2, default: 0.0 })
  subTotal: number;

  @Column({ type: "int", default: 4 })
  size: number;

  @Column({ type: "boolean", default: false })
  inUse: boolean;

  @OneToMany(() => Order, (order) => order.table)
  order: Order[];
}
