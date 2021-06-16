import { getRepository } from 'typeorm';
import { hash } from 'bcrypt';

import User from '../models/User';

import AppError from '../errors/AppError';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExist = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExist) {
      throw new AppError('Email address already used.');
    }

    const hashedPassord = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassord,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
