import { classToClass } from 'class-transformer';
import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import AlbumService from '../services/Album.service';

const albumRouter = Router();
const albumService = new AlbumService();
const upload = multer(uploadConfig);

albumRouter.use(ensureAuthenticated);

// Get list of albuns
albumRouter.get('/', async (request, response) => {
  const appointments = await albumService.getAllAlbunsFromUserId(
    request.user.id,
  );

  return response.json(appointments);
});

// Delete an album
albumRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await albumService.deleteAlbum(id);

  return response.status(200).json();
});

// Create a new album
albumRouter.post('/', async (request, response) => {
  const { name } = request.body;

  const album = await albumService.createNewAlbum({
    user_id: request.user.id,
    name,
  });

  return response.json(album);
});

// Edit album name
albumRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { name } = request.body;

  const album = await albumService.editAlbumName({
    album_id: id,
    name,
  });

  return response.json(album);
});

// Add a new photo on album
albumRouter.post(
  '/photo',
  ensureAuthenticated,
  upload.single('photo'),
  async (request, response) => {
    const { album_id } = request.body;

    const photo = await albumService.addNewPhotoToAlbum({
      album_id,
      photoFileName: request.file.filename,
    });

    return response.json(classToClass(photo));
  },
);

// Add photo from album with photo ID
albumRouter.delete('/photo/:id', async (request, response) => {
  const { id } = request.params;
  await albumService.deletePhotoFromPhotoId(id);

  return response.status(200).json();
});

// Get list of photos from album ID
albumRouter.get('/photo/:id', async (request, response) => {
  const album_id = request.params.id;

  const photos = await albumService.getPhotosFromAlbum(album_id);

  return response.json(classToClass(photos));
});

export default albumRouter;
