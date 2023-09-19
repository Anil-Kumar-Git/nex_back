import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  Generated,
  CreateDateColumn,
  Unique,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';
import { Operators } from '../operators/operators.entity';
import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
@Unique(['proposalName', 'operatorId'])
export class OperatorProposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  proposalName!: string;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn()
  createdBy!: Users;

  @ManyToOne(() => Operators, { nullable: false })
  @JoinColumn()
  operatorId!: Operators;

  //Local Licenses available in
  @Column()
  localLicenses!: string;//string[];

  @Column()
  restrictedCountries!: string;//string[];

  //RevShare to Provider
  @Column({ nullable: true,type: 'decimal', precision: 10, scale: 2  })
  revShareProvider: number;

  //Accept Revshare tied to Revenue tiers?
  @Column()
  revshareRevenueTiers !: boolean;

  //RevShare to Provider in tiers
  @Column({ nullable: true })
  revShareProviderTiers: string;

  //Number of games offered (approx.)
  @Column()
  numberOfGamesOffered!: number;

  //Number of monthly active users (approx)
  @Column()
  numberOfMonthlyActiveUsers!: number;

  //Alexa rank in strongest country
  @Column({ default: 0 })
  alexaRankInStrongestCountry: number;

  //Number of brands
  @Column({ default: 0 })
  numberOfBrands: number;

  //make this proposal default
  @Column({ default: false })
  default: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;
}
