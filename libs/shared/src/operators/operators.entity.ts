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
} from 'typeorm';

import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';

import { Users } from './../users/users.entity';

export enum servicePlan {
  Startup = "Free Startup Plan <3", Freemium = "Freemium", PremiumOperator = "Premium Operator", GoldOperator = "Gold Operator"
}

@Entity()
export class Operators {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  usednexus!: boolean;

  @Column({ nullable: false })
  @Index('companyName', { unique: true })
  @IsNotEmpty({ message: 'companyName is required' })
  companyName!: string;

  @Column({ nullable: false })
  @Index('companyEmail', { unique: true })
  companyEmail: string;

  @Column({ nullable: true })
  currentQuarterRank: number;

  @Column({ nullable: true })
  lastQuarterRank: number;

  @Column({ nullable: true })
  website: string;
  

  @Column({ default: "" })
  oldId: string;

  @Column({ default: "" })
  ipRange: string;

  @Column({ nullable: false })
  vatId: string;

  @Column({ nullable: false })
  taxId!: string;

  //Company Registration Number
  @Column({ nullable: false })
  registrationNumber!: string;

  @Column({ nullable: false })
  address: string;

  @Column({ default: "" })
  city: string;

  @Column({ default: "" })
  state: string;

  @Column({ default: "" })
  zip: string;

  @Column({ default: "" })
  logo: string;

  @Column({ default: "" })
  memberId: string;

  @Column({ default: "" })
  planStatus: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: servicePlan,
  })
  @IsEnum(servicePlan)
  @IsNotEmpty({ message: 'The servicePlan is required' })
  servicePlan!: servicePlan;

  @Column({nullable: false, default: "" })
  planDetails: string;

  @OneToOne((type) => Users, { nullable: false })
  @JoinColumn()
  createdBy!: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  //Accepted tern and conditions
  @Column({ default: false })
  isAcceptedTerm: boolean;

  @Column({ default: true })
  emailSubscription: boolean;
}
