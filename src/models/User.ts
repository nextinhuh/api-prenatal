/* eslint-disable camelcase */
import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Consult from './Consult';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password?: string;

  @Column()
  first_login: boolean;

  @Column({ nullable: true })
  gender_preference: string;

  @Column({ nullable: true })
  menstruation_date: Date;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Consult, consult => consult.user)
  consults: Consult[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar' })
  getPhoto_url(): string | null {
    if (!this.avatar) {
      return null;
    }

    return `http://localhost:3333/files/${this.avatar}`;
  }
}

export default User;
