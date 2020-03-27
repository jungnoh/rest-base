import { Order, User, Address, OrderItem } from "../../../common/models";
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity, OneToOne, OneToMany } from "typeorm";
import UserEntity from "./user";
import { OrderStatus, PaymentType } from "../../../common/models/order";
import AddressEntity from "./address";
import OrderItemEntity from "./orderItem";

@Entity()
export default class OrderEntity implements Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP', nullable: false})
  createdAt: Date;

  @Column('timestamp')
  paymentAt: Date;

  @ManyToOne(type => UserEntity)
  user: User;

  @Column('enum', {enum: OrderStatus, default: OrderStatus.PendingPayment})
  status: OrderStatus;

  @Column('enum', {enum: PaymentType, default: PaymentType.None})
  paymentType: PaymentType;

  @Column('varchar', {length: 40})
  impPurchaseId: string;

  @OneToOne(type => AddressEntity)
  address: Address;

  @Column('varchar', {length: 40, nullable: true})
  packageId: string;

  @OneToMany(type => OrderItemEntity, orderItem => orderItem.order)
  items: OrderItem[];
}