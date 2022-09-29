import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("group_users")
export class GroupUser {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Column({ type: "varchar", unique: true })
  name: string;
}
