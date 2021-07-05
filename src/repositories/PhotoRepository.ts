import { EntityRepository, Repository } from 'typeorm';

import Photo from '../models/Photo';

@EntityRepository(Photo)
class AlbumRepository extends Repository<Photo> {
  public async findPhotoList(albumId: string): Promise<Photo[]> {
    const photos = this.find({ where: { album_id: albumId } });

    return photos;
  }
}

export default AlbumRepository;
