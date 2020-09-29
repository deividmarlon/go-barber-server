import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  new_password?: string;
}

@injectable()
class UpdateProfileService {
  /** Princípio: Dependency Inversion
   * Sempre que o Service tiver uma dependência externa,
   * iremos receber tal dependência como um parâmetro da Classe no constructor
   */
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,


  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    new_password
  }: IRequestDTO): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    console.log(user);

    if (!user) {
      throw new AppError('User not found!',401,);
    }

    const userWithEmailToUpdate = await this.usersRepository.findByEmail(email);

    if (userWithEmailToUpdate && userWithEmailToUpdate.id !== user_id) {
      throw new AppError('New e-mail already used by another user!',401,);
    }

    user.name = name;
    user.email = email;

    if(new_password && !old_password){
      throw new AppError('You need to inform the old password to set a new one!',401,);
    }

    if(new_password && old_password){
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      )

      if(!checkOldPassword){
        throw new AppError('Old password does not match!',401,);
      }
      user.password =  await this.hashProvider.generateHash(new_password);
    }

    return await this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
