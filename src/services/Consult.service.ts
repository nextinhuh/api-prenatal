import { getRepository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';

import AppError from '../errors/AppError';
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
    if (!uuidValidate(patient_id) || !uuidValidate(user_id)) {
      throw new AppError('ID is not valid.', 400);
    }
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
      user_id,
      patient_id,
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
        user_id,
        patient_id,
      },
      prescriptions,
    };

    return newConsult;
  }

  public async getAllConsultsFromUserId(user_id: string): Promise<Consult[]> {
    if (!uuidValidate(user_id)) {
      throw new AppError('User ID is not valid.', 400);
    }
    const consutlRepository = getRepository(Consult);

    const consults = await consutlRepository.find({
      relations: ['prescriptions'],
      where: { patient_id: user_id },
    });

    return consults;
  }

  public async getAllConsultsCreatedByUserId(user_id: string): Promise<User[]> {
    if (!uuidValidate(user_id)) {
      throw new AppError('User ID is not valid.', 400);
    }
    const userRepository = getRepository(User);

    const userConsultCreatedList = await userRepository.find({
      relations: ['consults'],
      where: { id: user_id },
    });

    return userConsultCreatedList;
  }

  public async getConsultByID(
    consult_id: string,
  ): Promise<Consult | undefined> {
    if (!uuidValidate(consult_id)) {
      throw new AppError('Consult ID is not valid.', 400);
    }
    const consutlRepository = getRepository(Consult);

    const consult = await consutlRepository
      .findOne({
        where: { id: consult_id },
      })
      .catch(() => {
        throw new AppError('Consult not found.', 400);
      });

    return consult;
  }
}

export default ConsultService;
