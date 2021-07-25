import { classToClass } from 'class-transformer';
import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import ConsultService from '../services/Consult.service';

const consultRouter = Router();
const consultService = new ConsultService();

consultRouter.use(ensureAuthenticated);

// Create a new consult
consultRouter.post('/', async (request, response) => {
  const { prescriptions, medicalRecords, patient_id } = request.body;

  const constult = await consultService.createNewConsult({
    prescriptions,
    medicalRecords,
    patient_id,
    user_id: request.user.id,
  });

  return response.json(constult);
});

// Get list of consults from user ID
consultRouter.get('/', async (request, response) => {
  const consults = await consultService.getAllConsultsFromUserId(
    request.user.id,
  );

  return response.json(consults);
});

// Get list of consults created by user ID
consultRouter.get('/created', async (request, response) => {
  const userConsultCreatedList = await consultService.getAllConsultsCreatedByUserId(
    request.user.id,
  );

  return response.json(classToClass(userConsultCreatedList));
});

// Get consults by ID
consultRouter.get('/:id', async (request, response) => {
  const { id } = request.params;
  const consult = await consultService.getConsultByID(id);

  return response.json(consult);
});

export default consultRouter;
