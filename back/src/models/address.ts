import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Address } from "../../../common/models";

@Entity()
export default class AddressEntity implements Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", {length: 40})
  name: string;

  @Column("varchar", {length: 40})
  phone: string;

  @Column("varchar", {length: 80})
  address1: string;

  @Column("varchar", {length: 80})
  address2: string;

  @Column("varchar", {length: 10})
  postalCode: string;
}