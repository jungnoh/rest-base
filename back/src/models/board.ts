import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Board } from "../../../common/models";

@Entity()
export default class BoardEntity implements Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {length: 20})
  key: string;

  @Column('boolean', {default: false})
  showComments: boolean;

  @Column('boolean', {default: false})
  showCommentRatings: boolean;
}
