import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { GroupUser } from "./groupUser.entity";
import { Exclude } from "class-transformer";
import { Order } from "./order.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "boolean", default: "true" })
  isActive: boolean;

  @Column({ type: "varchar" })
  @Exclude()
  password: string;

  @CreateDateColumn({ type: "date" })
  createdAt: Date;

  @UpdateDateColumn({ type: "date" })
  updatedAt: Date;

  @OneToMany(() => Order, (Order) => Order.user)
  orders: Order[];

  @ManyToOne(() => GroupUser, { eager: true })
  groupUser: GroupUser;
}
