import { classToClass } from 'class-transformer';
import { Router } from 'express';

import UserService from '../services/User.service';

const sessionsRouter = Router();
const userService = new UserService();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const { user, token } = await userService.authenticateUser({
    email,
    password,
  });

  delete user.password;

  return response.json({
    user: classToClass(user),
    token,
  });
});

export default sessionsRouter;
