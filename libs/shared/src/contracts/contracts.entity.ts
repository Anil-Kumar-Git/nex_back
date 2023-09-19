import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  Generated,
  CreateDateColumn,
  Unique,
  OneToOne,
  JoinColumn,
  VersionColumn,
  ManyToOne,
} from 'typeorm';

import { IsEmail, IsNotEmpty, Length } from 'class-validator';

import { Operators } from './../operators/operators.entity';
import { Providers } from './../providers/providers.entity';
import { Users } from '../users/users.entity';
import { Games } from '../games/games.entity';


export enum revShareBasedField {
  GGR = "GGR",
  NGR = "NGR"
}

export enum contractStatus {
  DRAFT = "Draft",
  PUBLISHED = "Published",
}

@Entity()
@Unique(['providerId', 'operatorId'])
export class Contracts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: string;

  @Column({ nullable: false })
  contractName!: string;

  @VersionColumn()
  contractVersion: number;

  //Contract Start Date
  @Column({ type: 'date', nullable: false })
  startDate!: Date;

  //Contract Duration
  @Column({ nullable: true })
  duration: number;

  //Contract Termination Period
  @Column({ nullable: true })
  termPeriod: number;

  //Auto Renewal Period if not Terminated
  @Column({ nullable: true })
  autoRenewPerTerm: number;

  //Are all Games Included?
  @Column({ nullable: true })
  allGamesInclude: boolean;

  //Grace Period for Minimum Absolute Revshare Fee
  @Column()
  gracePerMin: number;

  //Minimum Absolute Revshare Fee to be Generated
  @Column()
  minRevshareGen: number;

  @Column()
  setUpCost: number;

  //Bonuses and Promotions included?
  @Column({ default: false })
  bonusPromotions: boolean;

  //Bonus Cap: Up to which % can the bonus be allocated to Provider?
  @Column({ nullable: true })
  bonusCap: number;



  //List of Game include in this contract
  @Column({ nullable: true }) //@Column("text", { array: true })
  gameExceptions: string; //string[];

  @Column() //@Column("text", { array: true, nullable: false })
  includedCountries: string; //string[];

  @Column() //@Column("text", { array: true, nullable: false })
  restrictedCountries: string; //string[];

  //Local Licenses available in
  @Column() //@Column("text", { array: true, nullable: false })
  localLicenses: string; //string[];

  //Revshare tied to Revenue Tiers?
  @Column() //@Column("text", { array: true})
  revshareRevenueTiers: boolean; //string[];

  //RevShare to Provider in %
  @Column({ nullable: true,type: 'decimal', precision: 10, scale: 2 })
  revShareProvider: number;

  //RevShare to Provider in %
  @Column({ nullable: true })
  revShareProviderTiers: string;

  @Column({ nullable: false })
  currency: string;

  //RevShare based on GGR (Bet-Win) or NGR (Bet-Win-Bonus-Taxes)
  @Column({
    type: 'enum',
    enum: revShareBasedField,
    default: revShareBasedField.GGR,
  })
  revShareBased: revShareBasedField;


  //Revshare tied to Game Type  
  @Column()
  revShareTiedToGameType: boolean;

  @Column({ nullable: true })
  gameType: string;

  //Branded Game surcharge in %
  @Column({ default: 0, nullable: true })
  brandedGameSurchargeIn: number;


  //Negative carry over allowed?
  @Column({ nullable: true })
  negativeCarryOverAllowed: boolean;


  //Upload physical Contract
  @Column({ nullable: true })
  physicalContract: string;

  @Column({ nullable: false })
  operatorId!: string;

  @Column({ nullable: false })
  providerId!: string;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn()
  createdBy!: Users;

  @Column({ nullable: false })
  @Index('index')
  index!: string;//operator provider

  @Column({ nullable: false })
  @Index('refIndex')
  refIndex!: string;//ohter id should be Internal or Provider

  //make this proposal default
  @Column({ default: false })
  default: boolean;

  @Column({
    type: "enum",
    enum: contractStatus,
    default: contractStatus.DRAFT,
  })
  status!: contractStatus;
}
