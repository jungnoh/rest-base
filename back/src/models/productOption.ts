import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { ProductOption, Product } from "../../../common/models";
import ProductEntity from "./product";

@Entity()
export default class ProductOptionEntity implements ProductOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => ProductEntity)
  product: Product;

  @Column('varchar', {length: 160})
  name: string;

  @Column('int', {unsigned: true})
  originalPrice: number;

  @Column('int', {unsigned: true})
  price: number;

  @Column('int', {unsigned: true})
  stockCount: number;
}