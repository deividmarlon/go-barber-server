import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

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
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({user_id}: IRequestDTO): Promise<User[]> {

    let providers = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`);

    if(!providers){
      providers = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      console.log('A query no banco foi feita!');

      await this.cacheProvider.save(`providers-list:${user_id}`, providers);
    }

    return providers
  }
}

export default ListProvidersService;
