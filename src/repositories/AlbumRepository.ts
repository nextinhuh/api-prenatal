import { EntityRepository, Repository } from 'typeorm';

import Album from '../models/Album';

@EntityRepository(Album)
class AlbumRepository extends Repository<Album> { }

export default AlbumRepository;
