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

import { IsEmail, IsNotEmpty, Length, IsEnum, IsDate } from 'class-validator';
import { userRole, userType } from '../common/interfaces/errorResponse.interface';


@Entity()
@Unique(['email'])
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  apiKey: string;

  @Column({ nullable: false, name: 'email' })
  @Index('email', { unique: true })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email!: string;

  @Column({ nullable: false })
  @Length(2, 30, {
    message:
      'The firstname must be at least 2 but not longer than 30 characters',
  })
  @IsNotEmpty({ message: 'The firstname is required' })
  firstname!: string;

  @Column({ nullable: true })
  @Length(2, 30, {
    message:
      'The lastname must be at least 2 but not longer than 30 characters',
  })
  @IsNotEmpty({ message: 'The lastname is required' })
  lastname!: string;

  @Column({ nullable: false })
  @Length(6, 30, {
    message:
      'The password must be at least 6 but not longer than 30 characters',
  })
  @IsNotEmpty({ message: 'The password is required' })
  password!: string;

  @CreateDateColumn()
  createdAt: string;

  @Column({ nullable: false })
  mobile!: string;

  @Column({ default: '' })
  whatsapp: string;

  @Column({ default: '' })
  skype: string;

  @Column({ default: '' })
  slack: string;

  @Column({ default: '' })
  telegram: string;

  @Column({ default: '' })
  signal: string;

  @Column({ default: '' })
  viber: string;

  @Column({ default: '' })
  discord: string;

  @Column({ default: true })
  initialUser: boolean;

  @Column({ default: false })
  profileCompleted: boolean;



  @Column({
    type: 'enum',
    nullable: false,
    enum: userRole,
  })//deafult role, user type
  @IsEnum(userRole, { message: 'User role must be either "provider" , "operator" or "admin' })
  userRole!: userRole;//provider operator admin

  @Column({
    type: 'enum',
    enum: userType,
    default: userType.TECHNICAL_UER
  })//deafult role, user type
  @IsEnum(userType)
  userType!: userType;//technical user , commercial user

  @Column({ default: null, nullable: true })
  deactivationDate: Date;


}
