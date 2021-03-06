import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;
describe('UpdateUserAvatar', ()=>{
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
  })

  it('should be able to update user avatar', async ()=>{
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    await updateUserAvatar.execute({
      user_id:user.id,
      avatar_filename: 'avatar.png'
    })

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update avatar from non existing user', async ()=>{
    await expect(
      updateUserAvatar.execute({
        user_id:'non-existing-user',
        avatar_filename: 'avatar.png'
      })
    ).rejects.toBeInstanceOf(AppError);

  });

  it('should be able to delete older user avatar when updating a new one', async ()=>{
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    //jest.spyOn consegue retornar e observar uma função
    const deleteFileFunction = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await updateUserAvatar.execute({
      user_id:user.id,
      avatar_filename: 'avatar.png'
    })

    await updateUserAvatar.execute({
      user_id:user.id,
      avatar_filename: 'newAvatar.png'
    })

    expect(deleteFileFunction).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toBe('newAvatar.png');
  });

})
