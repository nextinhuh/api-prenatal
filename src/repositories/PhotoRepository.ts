import { EntityRepository, Repository } from 'typeorm';

import Photo from '../models/Photo';

@EntityRepository(Photo)
class AlbumRepository extends Repository<Photo> {
  public async findFirstPhotoNameFromAlbumID(
    albumId: string,
  ): Promise<string | undefined> {
    const photo = await this.findOne({ where: { album_id: albumId } });

    return photo?.photo_name;
  }
}

export default AlbumRepository;
