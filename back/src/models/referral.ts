import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Referral, User, Product } from "../../../common/models";
import UserEntity from "./user";
import ProductEntity from "./product";

@Entity()
export default class ReferralEntity implements Referral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {length: 32, unique: true})
  hashId: string;

  @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP', nullable: false})
  createdAt: Date;

  @ManyToOne(type => UserEntity)
  creator: User;

  @ManyToOne(type => ProductEntity)
  product: Product;

  @Column('int', {default: 0, unsigned: true})
  purchaseCount: number;

  @Column('int', {default: 0, unsigned: true})
  purchaseAmount: number;
}