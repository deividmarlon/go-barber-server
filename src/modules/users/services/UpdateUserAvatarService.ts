import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  avatar_filename: string;
}
@injectable()
class UpdateUserAvatarService {
  /** Princípio: Dependency Inversion
   * Sempre que o Service tiver uma dependência externa,
   * iremos receber tal dependência como um parâmetro da Classe no constructor
   */
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    avatar_filename,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can update the avatar!',
        401,
      );
    }

    if (user.avatar) {
      const localFilesDirectory = uploadConfig.directory;

      const userAvatarLocalFilePath = path.join(
        localFilesDirectory,
        user.avatar,
      );
      const userAvatarFileExists = await fs.promises.stat(
        userAvatarLocalFilePath,
      );
      // A função fs.promises.stat() traz o status do arquivo caso o arquivo exista!

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarLocalFilePath);
        // A função fs.promises.unlink() irá delatar o arquivo
      }
    }

    user.avatar = avatar_filename;
    // A instância do user capturado no banco já está criada em user!

    await this.usersRepository.save(user);
    // Salva a alteração da instância no banco

    return user;
  }
}

export default UpdateUserAvatarService;
