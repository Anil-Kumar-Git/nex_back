import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity()
export class Reconciliation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index("providerId")
    @Column()
    providerId: string;

    @Index("operatorId")
    @Column()
    operatorId: string;

    @Column()
    index: string;

    @Column()
    refIndex: string;

    @Column()
    reconciliationFile: string;


    @ManyToOne(() => Users)
    @JoinColumn()
    createdBy: Users;

    @Column({ type: 'timestamp', nullable: true })
    referenceDate: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    modifiedDate: Date;
}


