import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import User from '../../../common/models/user';

@Entity()
export default class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  name: string;
}