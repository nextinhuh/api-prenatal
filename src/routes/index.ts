import { Router } from 'express';
import albumRouter from './album.routes';
import consultRouter from './consult.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import noteRouter from './note.routes';

const routes = Router();

routes.use('/album', albumRouter);
routes.use('/consult', consultRouter);
routes.use('/note', noteRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
