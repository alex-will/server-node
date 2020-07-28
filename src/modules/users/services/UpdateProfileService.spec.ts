import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('shold be able update to profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhon@gmail.com',
      name: 'jhon doe',
      password: '123456',
    });

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      email: 'jhont@gmail.com',
      name: 'jhon tre',
    });

    expect(updateUser.name).toBe('jhon tre');
    expect(updateUser.email).toBe('jhont@gmail.com');
  });

  it('shold not be able update the profile from non existing user', async () => {
    expect(
      updateProfileService.execute({
        user_id: 'non existing user id',
        email: 'teste@gmail.com',
        name: 'test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shold not be able update to change to another user email', async () => {
    await fakeUsersRepository.create({
      email: 'jhon@gmail.com',
      name: 'jhon doe',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      email: 'test@gmail.com',
      name: 'test',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'jhon@gmail.com',
        name: 'jhon doe',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shold be able update the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhon@gmail.com',
      name: 'jhon doe',
      password: '123456',
    });

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'jhon doe',
      email: 'jhon@gmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updateUser.password).toBe('123123');
  });

  it('shold not be able update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhon@gmail.com',
      name: 'jhon doe',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'jhont@gmail.com',
        name: 'jhon tre',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shold be able update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhon@gmail.com',
      name: 'jhon doe',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'jhont@gmail.com',
        name: 'jhon tre',
        old_password: 'wrong old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
