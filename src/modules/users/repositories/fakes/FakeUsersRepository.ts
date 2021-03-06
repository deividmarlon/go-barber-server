import {uuid} from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '@modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {

  private users:User[] = [];

  public async findById(id: string): Promise<User | undefined> {
      const findUserById = this.users.find(user=>user.id===id);

      return findUserById
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUserByEmail = this.users.find(user=>user.email===email);

    return findUserByEmail
  }

  public async findAllProviders({except_user_id}:IFindAllProvidersDTO): Promise<User[]>{
    if(except_user_id){
      const providers = this.users.filter(user => user.id !==except_user_id);

      return providers;
    }

    return this.users;
  }

  public async create({name,email,password,}:ICreateUserDTO): Promise<User> {

    const user = new User();

    Object.assign(user,{id:uuid(), name,email,password});

    this.users.push(user);

    return user;

  }

  public async save(user: User): Promise<User> {
      this.users.map(userItem=>{
        if(userItem.id===user.id){
          return user;
        }else{
          return userItem;
        }
      })
      return user;
  }
}

export default FakeUsersRepository;
