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
import { Games } from '../games/games.entity';
import { Contracts } from '../contracts/contracts.entity';
import { Providers } from '../providers/providers.entity';

enum GameTrackingStatus {
  Transmitted = "Transmitted",
  Accepted = "Accepted",
  Queued = "Queued",
  Live = "Live",
  Rejected = "Rejected",
  Disabled = "Disabled",
  ReEnabled = "Re-Enabled",
  Deleted = "Deleted",
  Deprecated = "Deprecated"
}

@Entity()
export class GameTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => Games,{ nullable: false })
  @JoinColumn()
  @Index("Games")
  gameId: Games

  @Column()
  @Index("proposalId")
  proposalId: string

  @ManyToOne(type => Contracts,{ nullable: false })
  @JoinColumn()
  @Index("Contracts")
  contractId: Contracts

  @ManyToOne(type => Providers,{ nullable: false })
  @JoinColumn()
  @Index("Providers")
  providerId: Providers

  @Column()
  operatorId!: string;

  @Column()
  index!: string;

  @Column()
  refIndex!: string;

  @Column({
    type: "enum",
    enum: GameTrackingStatus,
    default: GameTrackingStatus.Transmitted,

  })
  status!: GameTrackingStatus;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn()
  createdBy!: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date;
}


