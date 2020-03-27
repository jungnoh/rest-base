import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Comment from "../../../common/models/comment";
import PostEntity from "./post";
import Post from "../../../common/models/post";
import UserEntity from "./user";
import { User } from "../../../common/models";

@Entity()
export default class CommentEntity implements Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP', nullable: false})
  createdAt: Date;

  @ManyToOne(type => PostEntity, post => post.comments)
  post: Post;

  @ManyToOne(type => UserEntity)
  author: User;

  @Column('mediumtext')
  content: string;

  @Column('tinyint', {unsigned: true})
  rating: number;
}
