import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import CampaignLog from "../../../common/models/campaignLog";

@Entity()
export default class CampaignLogEntity implements CampaignLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {length: 20})
  type: string;

  @Column('varchar', {length: 80})
  method: string;

  @Column('varchar', {nullable: true})
  searchTerm?: string;

  @Column('varchar', {length: 40})
  ip: string;

  @Column('varchar', {length: 40, nullable: true})
  country?: string;

  @Column('varchar', {length: 40, nullable: true})
  region?: string;
}
