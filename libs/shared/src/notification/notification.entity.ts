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

export enum Status {
  seen = 'seen',
  unseen = 'unseen',
}


@Entity()
export class Notification {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index('senderId')
  senderId: string;

  @Column()
  @Index('receiverId')
  receiverId: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  link: string;

  @Column(
    {
      type: 'enum',
      enum: Status,
      default: Status.unseen,
    }
  )
  status: Status;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date;
}


export class NotificationShare {
  senderId?: string;
  receiverId?: { id?: string; email?: string };
  message: { title?: string; body?: string; link?: string,type?:string };
  constructor() {
    this.message = {};
  }
}
