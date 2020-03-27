import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Board, Comment, Post, User } from '../../../common/models';
import UserEntity from './user';
import BoardEntity from './board';
import CommentEntity from './comment';

@Entity()
export default class PostEntity implements Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => BoardEntity)
  board: Board;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, {onDelete: 'CASCADE', nullable: false})
  author: User;

  @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP', nullable: false})
  createdAt: Date;

  @OneToMany(type => CommentEntity, comment => comment.post)
  comments: Comment[];
}