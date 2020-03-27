import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import {Post, User} from '../../../common/models';
import UserEntity from './user';

@Entity()
export default class PostEntity implements Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  board: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, {onDelete: 'CASCADE', nullable: false})
  author: User;

  @Column('timestamp with time zone', {default: () => 'CURRENT_TIMESTAMP', nullable: false})
  createdAt: Date;
}