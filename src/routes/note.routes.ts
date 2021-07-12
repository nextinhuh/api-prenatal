import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import NoteService from '../services/Note.service';

const noteRouter = Router();
const noteService = new NoteService();

noteRouter.use(ensureAuthenticated);

// Create a new note
noteRouter.post('/', async (request, response) => {
  const { description, title } = request.body;

  const note = await noteService.createNewNote({
    user_id: request.user.id,
    description,
    title,
  });

  return response.json(note);
});

// Get list of notes
noteRouter.get('/', async (request, response) => {
  const notes = await noteService.getAllNotesFromUserId(request.user.id);

  return response.json(notes);
});

// Get note by ID
noteRouter.get('/:id', async (request, response) => {
  const { id } = request.params;
  const note = await noteService.getNoteByID(id);

  return response.json(note);
});

// Edit note
noteRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { description, title } = request.body;

  const note = await noteService.editNote({
    description,
    note_id: id,
    title,
  });

  return response.json(note);
});

// Delete an note
noteRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await noteService.deleteNote(id);

  return response.status(200).json();
});

export default noteRouter;
