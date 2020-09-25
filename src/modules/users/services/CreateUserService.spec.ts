import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';


describe('CreateUser', ()=>{
  it('should be able to create a new user', async ()=>{
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@gmail.com');
  });

  it('should not be able to create a new user with an existing email', async ()=>{
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    const userEmail = 'johndoe@gmail.com';

    await createUser.execute({
      name: 'John Doe',
      email: userEmail,
      password: '123456'
    })

    expect(
      createUser.execute({
        name: 'John Doe',
        email: userEmail,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

})
