import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Products } from "./product.entity";

@Entity("categories")
export class Categories {
  @PrimaryGeneratedColumn("increment")
  readonly id: number;

  @Column({ type: "varchar", unique: true, nullable: false })
  name: string;

  @OneToMany(() => Products, (product) => product.category)
  product: Products;
}
