import User from '@modules/users/infra/typeorm/entities/User';
import IUserCreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: IUserCreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
