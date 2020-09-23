import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

const appointmentsController = new AppointmentsController();
// Levando em consideração o conceito de SoC - Separation of Concerns,
// a rota deve se preocupar somente com:
//  Receber a requisição --> transformar dado se necessário -->
//  --> chamar outro arquivo --> devolver uma resposta

/* appointmentsRouter.get('/', async (request, response) => {
  const appointments = await appointmentsRepository.find();
  // o método appointmentsRepository.find retorna todos os registros!

  return response.json(appointments);
}); */

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
