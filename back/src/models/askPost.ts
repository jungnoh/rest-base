import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { AskPost, User } from "../../../common/models";
import UserEntity from "./user";

@Entity()
export default class AskPostEntity implements AskPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => UserEntity)
  author: User;

  @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP', nullable: false})
  createdAt: Date;

  @Column('timestamp', {nullable: true})
  answeredAt?: Date;

  @Column('varchar', {length: 160})
  title: string;

  @Column('mediumtext')
  content: string;

  @Column('mediumtext')
  answerContent: string;

  @Column('boolean', {default: false})
  answered: boolean;
}
