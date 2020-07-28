import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvier from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvier: FakeHashProvier;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvier = new FakeHashProvier();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvier);
  });

  it('shold be able to create a new user', async () => {
    const appointment = await createUser.execute({
      email: 'jhon@gmail.com',
      name: 'jhon doe',
      password: '123456',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('shold not be able to create a new user with a same email from another', async () => {
    await createUser.execute({
      email: 'jhon@gmail.com',
      name: 'jhon doe',
      password: '123456',
    });

    expect(
      createUser.execute({
        email: 'jhon@gmail.com',
        name: 'jhon doe',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
