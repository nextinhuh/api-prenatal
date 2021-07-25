import { getRepository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { validate as uuidValidate } from 'uuid';

import { sign } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import Note from '../models/Note';
import IEditNoteDTO from '../models/dtos/IEditNoteDTO';
import ICreateUserDTO from '../models/dtos/ICreateUserDTO';
import IAuthenticateUserDTO from '../models/dtos/IAuthenticateUserDTO';
import IGETUserAuthenticateDTO from '../models/dtos/IGETUserAuthenticateDTO';
import User from '../models/User';
import authConfig from '../config/auth';

class UserService {
  public async createNewUser({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExist = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExist) {
      throw new AppError('Email address already used.');
    }

    const hashedPassord = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassord,
      first_login: true,
    });

    if (!(await userRepository.save(user))) {
      throw new AppError('Error while create a new user.');
    }

    return user;
  }

  public async authenticateUser({
    email,
    password,
  }: IAuthenticateUserDTO): Promise<IGETUserAuthenticateDTO> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    let passwordMatched;
    if (user.password) {
      passwordMatched = await compare(password, user.password);
    }

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    if (user.first_login) {
      user.first_login = false;
      userRepository.save(user);
    }

    const { expiresIn, secret } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }

  public async getNoteByID(note_id: string): Promise<Note> {
    if (!uuidValidate(note_id)) {
      throw new AppError('Note ID is not valid.', 400);
    }
    const noteRepository = getRepository(Note);
    const note = await noteRepository.findOne({ where: { id: note_id } });

    if (!note) {
      throw new AppError('Note not found.', 400);
    }

    return note;
  }

  public async getAllNotesFromUserId(user_id: string): Promise<Note[]> {
    const noteRepository = getRepository(Note);
    const note = noteRepository.find({ where: { user_id } });

    return note;
  }

  public async editNote({
    description,
    title,
    note_id,
  }: IEditNoteDTO): Promise<Note> {
    const noteRepository = getRepository(Note);

    const note = await noteRepository.findOne(note_id);

    if (!note) {
      throw new AppError('Note not found.', 400);
    }

    note.title = title;
    note.description = description;

    await noteRepository.save(note);

    return note;
  }

  public async deleteNote(note_id: string): Promise<void> {
    const noteRepository = getRepository(Note);

    const note = await noteRepository.findOne(note_id);

    if (!note) {
      throw new AppError('Note not found.', 400);
    }

    if (!(await noteRepository.delete(note_id))) {
      throw new AppError('Error while delete note.');
    }
  }
}

export default UserService;
