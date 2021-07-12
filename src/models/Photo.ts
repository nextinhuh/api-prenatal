import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import Album from './Album';

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

  @ManyToOne(() => Album, album => album.photos)
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @Expose({ name: 'photo_url' })
  getPhoto_url(): string | null {
    if (!this.photo_name) {
      return null;
    }

    return `http://localhost:3333/files/${this.photo_name}`;
  }
}

export default Photo;
