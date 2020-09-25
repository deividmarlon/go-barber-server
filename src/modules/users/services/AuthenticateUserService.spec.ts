import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';


describe('AuthenticateUser', ()=>{
  it('should be able to authenticate user', async ()=>{

    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );


   await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    const response = await authenticateUser.execute({
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    expect(response).toHaveProperty('token');
  });

  it('should NOT be able to authenticate user with incorrect email', async ()=>{

    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

   await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    expect(
      authenticateUser.execute({
        email: 'johndoe3@gmail.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);

  });

  it('should NOT be able to authenticate user with wrong password', async ()=>{

    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

   await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    expect(
      authenticateUser.execute({
        email: 'johndoe@gmail.com',
        password: '123466'
      })
    ).rejects.toBeInstanceOf(AppError);

  });

})
