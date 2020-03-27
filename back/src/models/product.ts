import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product, ProductOption } from "../../../common/models";
import { ProductType } from "../../../common/models/product";
import ProductOptionEntity from "./productOption";

@Entity()
export default class ProductEntity implements Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', {enum: ProductType, default: ProductType.Item})
  type: ProductType;

  @Column('varchar', {length: 160})
  title: string;

  @Column('mediumtext')
  description: string;

  @Column('int', {unsigned: true})
  basePrice: number;

  @Column('boolean', {default: false})
  display: boolean;

  @OneToMany(type => ProductOptionEntity, option => option.product)
  options: ProductOption[];
}