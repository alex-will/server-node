import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('shold be able to reset password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'jhon doe',
      email: 'jhon@gmail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: '111222',
      token,
    });

    const updateuser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('111222');
    expect(updateuser?.password).toBe('111222');
  });

  it('should not be able to reset the password with non existing token', async () => {
    await expect(
      resetPassword.execute({
        password: '111222',
        token: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non existing user',
    );

    await expect(
      resetPassword.execute({
        password: '111222',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shold not be able to reset password if passed more than 2h', async () => {
    const user = await fakeUsersRepository.create({
      name: 'jhon doe',
      email: 'jhon@gmail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    expect(
      resetPassword.execute({
        password: '111222',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
