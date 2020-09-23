import { Router } from 'express';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import multer from 'multer';

import uploadConfig from '@config/upload';

const usersRouter = Router();

const upload = multer(uploadConfig);

// Levando em consideração o conceito de SoC - Separation of Concerns,
// a rota deve se preocupar somente com:
//  Receber a requisição --> transformar dado se necessário -->
//  --> chamar outro arquivo --> devolver uma resposta

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const usersRepository = new UsersRepository();

  const createUser = new CreateUserService(usersRepository);

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const usersRepository = new UsersRepository();

    const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

    const updatedUser = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatar_filename: request.file.filename,
    });

    delete updatedUser.password;

    return response.json(updatedUser);
  },
);

export default usersRouter;
