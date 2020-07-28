import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvier from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvier: FakeHashProvier;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvier = new FakeHashProvier();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvier);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvier,
    );
  });
  it('shold be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'jhn doe',
      email: 'jhon@gmail.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'jhon@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('shold not be able to authenticate with non existing user', async () => {
    expect(
      authenticateUser.execute({
        email: 'jhon@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shold not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'jhn doe',
      email: 'jhon@gmail.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'jhon@gmail.com',
        password: 'senha_errada',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
