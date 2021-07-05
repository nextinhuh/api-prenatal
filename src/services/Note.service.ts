import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import ICreateNoteDTO from '../models/dtos/ICreateNoteDTO';
import Note from '../models/Note';
import IEditNoteDTO from '../models/dtos/IEditNoteDTO';

class NoteService {
  public async createNewNote({
    description,
    title,
    user_id,
  }: ICreateNoteDTO): Promise<Note> {
    const noteRepository = getRepository(Note);
    const note = noteRepository.create({
      title,
      description,
      user_id,
    });

    if (!(await noteRepository.save(note))) {
      throw new AppError('Error while create a new note.');
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

export default NoteService;
