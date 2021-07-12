import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Prescription from './Prescription';

import User from './User';

@Entity('consults')
export class Consult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  weight: string;

  @Column()
  heigh: string;

  @Column()
  heart_rate: string;

  @Column()
  blood_pressure: string;

  @Column()
  abdominal_circumference: string;

  @Column()
  user_id: string;

  @Column()
  patient_id: string;

  @OneToMany(() => Prescription, prescription => prescription.consult)
  prescriptions: Prescription[];

  @ManyToOne(() => User, user => user.consults)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Consult;
