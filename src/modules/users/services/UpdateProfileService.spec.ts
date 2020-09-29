import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService'

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;


describe('UpdateProfile', ()=>{
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  })

  it('should be able to update the profile', async ()=>{
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    const updatedUser = await updateProfile.execute({
      user_id:user.id,
      name: 'John Who',
      email: 'who@gmail.com'
    })

    expect(updatedUser.name).toBe('John Who');
    expect(updatedUser.email).toBe('who@gmail.com');

  });

  it('should not be able to change email using an existing e-mail', async ()=>{
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    const user = await fakeUsersRepository.create({
      name: 'John Who',
      email: 'who@gmail.com',
      password: '123456'
    })

    await expect(
      updateProfile.execute({
        user_id:user.id,
        name: 'John Who',
        email: 'johndoe@gmail.com'
      })
    ).rejects.toBeInstanceOf(AppError);

  });

  it('should be able to update password', async ()=>{
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    const updatedUser = await updateProfile.execute({
      user_id:user.id,
      name: 'John Who',
      email: 'johndoe@gmail.com',
      old_password: '123456',
      new_password: '123123'
    })

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be to update password without old password', async ()=>{
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    await expect(
      updateProfile.execute({
        user_id:user.id,
        name: 'John Who',
        email: 'johndoe@gmail.com',
        new_password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)

  });

  it('should not be to update password with wrong old password', async ()=>{
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    await expect(
      updateProfile.execute({
        user_id:user.id,
        name: 'John Who',
        email: 'johndoe@gmail.com',
        old_password: 'wrong-old-password',
        new_password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)

  });
})
