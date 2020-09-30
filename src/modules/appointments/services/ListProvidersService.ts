import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
}

@injectable()
class ListProvidersService {
  /** Princípio: Dependency Inversion
   * Sempre que o Service tiver uma dependência externa,
   * iremos receber tal dependência como um parâmetro da Classe no constructor
   */
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({user_id}: IRequestDTO): Promise<User[]> {
    const providers = await this.usersRepository.findAllProviders({
      except_user_id:user_id
    });

    return providers
  }
}

export default ListProvidersService;
