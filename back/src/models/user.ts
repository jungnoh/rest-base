import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne } from 'typeorm';
import { Address, User } from '../../../common/models';
import { UserType } from '../../../common/models/user';
import AddressEntity from './address';

@Entity()
export default class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP', nullable: false})
  createdAt: Date;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column('varchar', {length: 20})
  name: string;

  @Column('varchar', {length: 40})
  phone: string;

  @Column('varchar', {length: 320})
  impIdentityKey: string;

  @Column('smallint', {default: 0})
  adminLevel: number;

  @Column('int', {default: 0})
  level: number;

  @Column('enum', {enum: UserType, default: UserType.Member})
  type: UserType;

  @Column('boolean', {default: true})
  allowSMS: boolean;

  @Column('boolean', {default: true})
  allowPush: boolean;

  @ManyToOne(type => AddressEntity, {cascade: true})
  address: Address;

  @Column('int', {default: 0, unsigned: true})
  balance: number;

  @Column('mediumtext')
  landingPage: string;

  @Column('boolean', {default: true})
  active: boolean;
} 