import { Router } from 'express';
import multer from 'multer';
import { classToClass } from 'class-transformer';
import uploadConfig from '../config/upload';

import UserService from '../services/User.service';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ISendMailDTO from '../models/dtos/ISendMailDTO';

const usersRouter = Router();
const userService = new UserService();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const user = await userService.createNewUser({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.put(
  '/update-profile',
  ensureAuthenticated,
  async (request, response) => {
    const { name, email, password } = request.body;

    const user = await userService.updateUserProfile({
      name,
      email,
      password,
      user_id: request.user.id,
    });

    return response.json(classToClass(user));
  },
);

usersRouter.put(
  '/user-preferences',
  ensureAuthenticated,
  async (request, response) => {
    const { genderPreference, menstruationDate } = request.body;

    const user = await userService.updateUserGenderPreferenceAndMenstruation({
      genderPreference,
      menstruationDate,
      user_id: request.user.id,
    });

    return response.json(classToClass(user));
  },
);

usersRouter.get('/profile', ensureAuthenticated, async (request, response) => {
  const user = await userService.getUserByID(request.user.id);

  return response.json(classToClass(user));
});

usersRouter.get(
  '/user-list',
  ensureAuthenticated,
  async (request, response) => {
    const user = await userService.getUserList(request.user.id);

    return response.json(classToClass(user));
  },
);

usersRouter.post('/forgot', async (request, response) => {
  const { email } = request.body;
  const sendEmailRecover = await userService.sendRecoverPasswordEmailService(
    email,
  );

  return response.json({ message: sendEmailRecover });
});

usersRouter.post('/reset-password', async (request, response) => {
  const { password, token } = request.body;

  await userService.resetUserPassword(password, token);

  return response.status(204).json();
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvar = new UpdateUserAvatarService();

    const user = await updateUserAvar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(classToClass(user));
  },
);

export default usersRouter;
