import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

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

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,


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
      this.storageProvider.deleteFile(user.avatar);
    }

    const savedFileName = await this.storageProvider.saveFile(avatar_filename);

    user.avatar = savedFileName;
    // A instância do user capturado no banco já está criada em user!

    await this.usersRepository.save(user);
    // Salva a alteração da instância no banco

    return user;
  }
}

export default UpdateUserAvatarService;
