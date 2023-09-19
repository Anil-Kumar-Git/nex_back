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


@Entity()
 export class GameThemes {
 
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false ,unique:true})
  @Index('gameTheme')
  gameTheme!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;
}
