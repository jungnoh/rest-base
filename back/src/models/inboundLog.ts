import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { InboundLog } from "../../../common/models";

@Entity()
export default class InboundLogEntity implements InboundLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  date: Date;

  @Column('varchar', {length: 20})
  type: string;

  @Column('varchar', {length: 80})
  method: string;

  @Column('int', {default: 0, unsigned: true})
  count: number;
}