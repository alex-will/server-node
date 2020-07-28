import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;

let showProfile: ShowProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('shold be able show the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhon@gmail.com',
      name: 'jhon doe',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('jhon doe');
    expect(profile.email).toBe('jhon@gmail.com');
  });

  it('shold not be able show the profile from non existing user', async () => {
    expect(
      showProfile.execute({
        user_id: 'non existing user id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
