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

enum proposalStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected"
}

@Entity()
export class ProposalTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  proposalId!: string;

  @Column({ nullable: false })
  senderId!: string;

  @Column({ nullable: false })
  receiverId!: string;

  @Column({
    type: "enum",
    enum: proposalStatus,
    default: proposalStatus.PENDING,

  })
  status!: proposalStatus;

  @Column({ default: "", nullable: true })
  rejectReason: string

  @Column({ nullable: false })
  index!: string;

  @Column({ nullable: false })
  refIndex!: string;


  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn()
  createdBy!: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date;
}
