import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();

const sessionsController = new SessionsController();

// Levando em consideração o conceito de SoC - Separation of Concerns,
// a rota deve se preocupar somente com:
//  Receber a requisição --> transformar dado se necessário -->
//  --> chamar outro arquivo --> devolver uma resposta

sessionsRouter.post('/', sessionsController.create);

export default sessionsRouter;
