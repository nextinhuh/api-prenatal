import { getCustomRepository, getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import { validate as uuidValidate } from 'uuid';

import Album from '../models/Album';
import AppError from '../errors/AppError';
import AlbumRepository from '../repositories/AlbumRepository';
import PhotoRepository from '../repositories/PhotoRepository';
import ICreateAlbumDTO from '../models/dtos/ICreateAlbumDTO';
import Photo from '../models/Photo';
import ICreatePhotoDTO from '../models/dtos/ICreatePhotoDTO';
import IEditAlbumDTO from '../models/dtos/IEditAlbumDTO';
import uploadConfig from '../config/upload';

class AlbumService {
  public async createNewAlbum({
    name,
    user_id,
  }: ICreateAlbumDTO): Promise<Album> {
    const albumRepository = getCustomRepository(AlbumRepository);
    const album = albumRepository.create({
      name,
      user_id,
    });

    if (!(await albumRepository.save(album))) {
      throw new AppError('Error while create a new album.');
    }

    return album;
  }

  public async deleteAlbum(album_id: string): Promise<void> {
    if (!uuidValidate(album_id)) {
      throw new AppError('Album ID is not valid.', 400);
    }

    const albumRepository = getCustomRepository(AlbumRepository);

    const album = await albumRepository.findOne(album_id);

    if (!album) {
      throw new AppError('Album not found.', 400);
    }

    if (!(await albumRepository.delete(album_id))) {
      throw new AppError('Error while delete album.');
    }
  }

  public async deletePhotoFromPhotoId(photo_id: string): Promise<void> {
    if (!uuidValidate(photo_id)) {
      throw new AppError('Photo ID is not valid.', 400);
    }
    const photoRepository = getCustomRepository(PhotoRepository);

    const photo = await photoRepository.findOne(photo_id);

    if (!photo) {
      throw new AppError('Photo not found.', 400);
    } else {
      // Delete photo on disk

      const photoFilePath = path.join(uploadConfig.directory, photo.photo_name);
      const photoFileExists = await fs.promises.stat(photoFilePath);

      if (photoFileExists) {
        await fs.promises.unlink(photoFilePath);
      }
    }

    if (!(await photoRepository.delete(photo_id))) {
      throw new AppError('Error while delete album.');
    }
  }

  public async getAllAlbunsFromUserId(
    user_id: string,
  ): Promise<Album[] | undefined> {
    const albumRepository = getCustomRepository(AlbumRepository);
    const photoRepository = getCustomRepository(PhotoRepository);

    const albuns = await albumRepository.find({ where: { user_id } });

    for (let i = 0; i < albuns.length; i++) {
      const photoName = await photoRepository.findFirstPhotoNameFromAlbumID(
        albuns[i].id,
      );
      if (photoName) {
        Object.assign(albuns[i], {
          cover_photo_url: photoName,
        });
      } else {
        Object.assign(albuns[i], {
          cover_photo_url: null,
        });
      }
    }

    return albuns;
  }

  public async addNewPhotoToAlbum({
    album_id,
    photoFileName,
  }: ICreatePhotoDTO): Promise<Photo> {
    if (!uuidValidate(album_id)) {
      throw new AppError('Album ID is not valid.', 400);
    }

    const photoRepository = getCustomRepository(PhotoRepository);
    const albumRepository = getCustomRepository(AlbumRepository);

    const album = await albumRepository.findOne(album_id);

    if (!album) {
      throw new AppError('Album not found.', 400);
    }

    const photo = photoRepository.create({
      album_id,
      photo_name: photoFileName,
    });

    await photoRepository.save(photo);

    return photo;
  }

  public async getPhotosFromAlbum(albumId: string): Promise<Photo[]> {
    if (!uuidValidate(albumId)) {
      throw new AppError('Album ID is not valid.', 400);
    }
    const photoRepository = getCustomRepository(PhotoRepository);
    const albumRepository = getCustomRepository(AlbumRepository);

    const album = await albumRepository.findOne(albumId);

    if (!album) {
      throw new AppError('Album not found.', 400);
    }

    const photo = photoRepository.find({ where: { album_id: albumId } });

    return photo;
  }

  public async editAlbumName({
    album_id,
    name,
  }: IEditAlbumDTO): Promise<Album> {
    if (!uuidValidate(album_id)) {
      throw new AppError('Album ID is not valid.', 400);
    }
    const albumRepository = getCustomRepository(AlbumRepository);

    const album = await albumRepository.findOne(album_id);

    if (!album) {
      throw new AppError('Album not found.', 400);
    }

    album.name = name;

    await albumRepository.save(album);

    return album;
  }

  public async getAlbumByID(album_id: string): Promise<Album> {
    if (!uuidValidate(album_id)) {
      throw new AppError('Album ID is not valid.', 400);
    }
    const albumRepository = getCustomRepository(AlbumRepository);

    const album = await albumRepository.findOne({
      where: { id: album_id },
    });

    if (!album) {
      throw new AppError('Album not found.', 400);
    }

    return album;
  }
}

export default AlbumService;
