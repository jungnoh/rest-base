import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToOne } from "typeorm";
import { OrderItem, Order, Product, ProductOption } from "../../../common/models";
import OrderEntity from "./order";
import ProductEntity from "./product";
import ProductOptionEntity from "./productOption";

@Entity()
export default class OrderItemEntity implements OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => OrderEntity)
  order?: Order;

  @Column('smallint', {unsigned: true})
  count: number;

  @Column('int', {unsigned: true})
  itemPrice: number;

  @ManyToOne(type => ProductEntity, {onDelete: 'SET NULL'})
  product: Product;

  @ManyToOne(type => ProductOptionEntity, {onDelete: 'SET NULL'})  
  option: ProductOption;

  @Column('varchar', {length: 160})
  productName: string;

  @Column('varchar', {length: 160})
  optionName: string;
}