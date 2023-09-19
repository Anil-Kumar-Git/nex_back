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
import { Operators } from '../operators/operators.entity';
export enum Status {
  Active = "Active",
  InActive = "InActive",
}
@Entity()
@Unique(['operatorId', 'providerId', 'index'])
export class ProviderOperator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  operatorId!: string;

  @Column({ nullable: false })
  providerId!: string;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn()
  createdBy!: Users;

  //who is the responsible for creating the items
  @Column({ nullable: false })
  index!: string; //who create the items :-provider operator

  @Column({ nullable: false })
  refID!: string //which id they are use for the creating the this items(scraper internal )  

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.InActive
  })
  status: Status;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

}
