import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

@Entity('photos')
class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  photo_name: string;

  @Column()
  album_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'photo_url' })
  getPhoto_url(): string | null {
    if (!this.photo_name) {
      return null;
    }

    return `http://localhost:3333/files/${this.photo_name}`;
  }
}

export default Photo;
