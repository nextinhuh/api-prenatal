import { createQueryBuilder, getRepository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';

import AppError from '../errors/AppError';
import ICreateNoteDTO from '../models/dtos/ICreateNoteDTO';
import Note from '../models/Note';
import IEditNoteDTO from '../models/dtos/IEditNoteDTO';
import ICreateConsultDTO from '../models/dtos/ICreateConsultDTO';
import Consult from '../models/Consult';
import Prescription from '../models/Prescription';
import User from '../models/User';
import IGETConsultDTO from '../models/dtos/IGETConsultDTO';

class ConsultService {
  public async createNewConsult({
    patient_id,
    user_id,
    medicalRecords,
    prescriptions,
  }: ICreateConsultDTO): Promise<IGETConsultDTO> {
    const consultRepository = getRepository(Consult);
    const userRepository = getRepository(User);
    const prescriptionRepository = getRepository(Prescription);

    if (user_id === patient_id) {
      throw new AppError('Patient can not create a consult for yourself.', 400);
    }

    const user = await userRepository.findOne({ where: { id: patient_id } });

    if (!user) {
      throw new AppError('Patient not found.', 400);
    }

    const consult = await consultRepository.save({
      abdominal_circumference: medicalRecords.abdominal_circumference,
      blood_pressure: medicalRecords.blood_pressure,
      heart_rate: medicalRecords.heart_rate,
      heigh: medicalRecords.heigh,
      weight: medicalRecords.weight,
      user_id: patient_id,
    });

    for (const prescription of prescriptions) {
      await prescriptionRepository.save({
        title: prescription.title,
        description: prescription.description,
        consult_id: consult.id,
      });
    }

    const newConsult = {
      medicalRecords: {
        abdominal_circumference: medicalRecords.abdominal_circumference,
        blood_pressure: medicalRecords.blood_pressure,
        heart_rate: medicalRecords.heart_rate,
        heigh: medicalRecords.heigh,
        weight: medicalRecords.weight,
        user_id: patient_id,
      },
      prescriptions,
    };

    return newConsult;
  }

  public async getAllConsultsFromUserId(user_id: string): Promise<Consult[]> {
    const consutlRepository = getRepository(Consult);

    const consults = await consutlRepository.find({
      relations: ['prescriptions'],
      where: { user_id },
    });

    return consults;
  }
  /*
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
  */
}

export default ConsultService;
