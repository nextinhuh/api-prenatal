import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Consult from './Consult';

@Entity('prescriptions')
class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  title: string;

  @Column()
  consult_id: string;

  @ManyToOne(() => Consult, consult => consult.prescriptions)
  @JoinColumn({ name: 'consult_id' })
  consult: Consult;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Prescription;
