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
 
enum Status {
  Active = "Active",
  Deactive = "Deactive",
}
@Entity()
@Unique(['companyId', 'userId'])
export class UserProviderOperator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  companyId!: string;

  @ManyToOne(() => Users, { nullable: false})
  @JoinColumn()
  userId!: Users;
 
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Active
  })
  status: Status;
}
