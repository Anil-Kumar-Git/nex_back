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

import { IsEmail, IsNotEmpty, Length, IsEnum } from 'class-validator';

import { Users } from './../users/users.entity';

export enum serviceProPlan {
  Startup = "Free Startup Plan <3", Freemium = "Freemium", PremiumProvider = "Premium Provider", GoldProvider = "Gold Provider"
}
@Entity()
export class Providers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  

  @Column({ default: '' })
  oldId: string;

  @Column()
  ipRange: string;

  @Column()
  vatId: string;

  @Column({ nullable: false })
  taxId!: string;

  //Company Registration Number
  @Column({ nullable: false })
  registrationNumber!: string;

  @Column()
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
    enum: serviceProPlan,
  })
  @IsEnum(serviceProPlan)
  @IsNotEmpty({ message: 'The servicePlan is required' })
  servicePlan!: serviceProPlan;

  @Column({ nullable: false, default: "" })
  planDetails: string;

  //Accepted term and conditions
  @Column({ default: false })
  isAcceptedTerm: boolean;

  @OneToOne((type) => Users, { nullable: false})
  @JoinColumn()
  createdBy: Users;

  @Column({ default: true })
  emailSubscription: boolean;
}
