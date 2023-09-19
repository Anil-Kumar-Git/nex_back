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
import { Providers } from '../providers/providers.entity';
export enum revShareBasedField {
  GGR = "GGR",
  NGR = "NGR"
}

@Entity()
@Unique(['proposalName', 'providerId'])
export class ProviderProposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  proposalName!: string;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn()
  createdBy!: Users;

  @ManyToOne(() => Providers, { nullable: false })
  @JoinColumn()
  providerId!: Providers;

  //Number of existing games in catalog
  @Column()
  NumberOfExistingGamesInCatalog!: number;//number;

  //Number of new games per year (approx)
  @Column()
  NumberOfNewGamesPerYear!: number;//number


  //Local Licenses available in
  @Column()
  localLicenses!: string;//string[];

  @Column()
  restrictedCountries!: string;//string[];

  //Included Countries
  @Column()
  includedCountries!: string;//string[];

  //RevShare to Provider
  @Column({type: 'decimal', precision: 10, scale: 2})
  revShareProvider: number;

  //RevShare based on GGR (Bet-Win) or NGR (Bet-Win-Bonus-Taxes)
  @Column({
    type: 'enum',
    enum: revShareBasedField,
    default: revShareBasedField.GGR,
  })
  revShareBased: revShareBasedField;


  //currency 
  @Column()
  currency!: string;

  //Revshare tied to Revenue tiers?
  @Column({ nullable: true })
  revshareRevenueTiers: boolean;

  //RevShare to Provider in tiers
  @Column({ nullable: true })
  revShareProviderTiers: string;

  //Revshare tied to Game Type  
  @Column()
  revShareTiedToGameType: boolean;

  @Column({ nullable: true })
  gameType: string;

  //Branded Game surcharge in %
  @Column({ default: 0, nullable: true })
  brandedGameSurchargeIn: number;

  //Minimum Absolute Revshare Fee to be Generated/ Month
  @Column({ default: 0, nullable: true })
  minimumAbsoluteRevshareFee: number;

  //Grace Period for Minimum Absolute Revshare Fee
  @Column({ default: 0, nullable: true })
  gracePeriodforMinimumAbsoluteRevshareFee: number;

  //Setup cost
  @Column({ default: 0, nullable: true })
  setUpCost: number;

  //Bonuses and Promotions included?
  @Column({ default: false })
  bonusesAndPromotionsIncluded: boolean;

  //make this proposal default
  @Column({ default: false })
  default: boolean;
}
