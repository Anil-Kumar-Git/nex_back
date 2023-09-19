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
} from "typeorm";

@Entity()
@Unique(["companyName", "index"])
export class externalProviderOpeartors {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  @Index("companyName")
  companyName: string;

  @Column({nullable: true })
  companyEmail: string;

  @Column({ nullable: true })
  currentQuarterRank: number;

  @Column({ nullable: true })
  lastQuarterRank: number;

  @Column({ nullable: true })
  website: string;

  @Column({nullable: true})
  @Index("oldId")
  oldId: string;

  @Column({ nullable: true })
  ipRange: string;

  @Column({ nullable: true })
  vatId: string;

  @Column({ nullable: true })
  taxId: string;

  //Company Registration Number
  @Column({ nullable: true })
  registrationNumber!: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: false })
  @Index("index")
  index!: string; //operator provider

  @Column({ default: true })
  emailSubscription: boolean;
}
